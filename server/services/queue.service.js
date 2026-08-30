import { EventEmitter } from 'events';

/**
 * Enterprise Background Queue Manager
 * Offloads heavy tasks (email dispatch, file cleanup, analytics calculations)
 * from the main Express HTTP thread. Supports retry logic and event tracking.
 */
class QueueService extends EventEmitter {
  constructor() {
    super();
    this.jobs = new Map();
    this.isProcessing = false;
    this.queue = [];
  }

  /**
   * Register a worker handler for a specific job name.
   * @param {string} name - Job identifier
   * @param {Function} handler - Async function taking (jobData)
   */
  registerWorker(name, handler) {
    this.jobs.set(name, handler);
  }

  /**
   * Dispatch a job to the background queue.
   * @param {string} name - Job identifier
   * @param {Object} data - Payload data for worker
   * @param {Object} options - Retry & delay options
   */
  async add(name, data, options = {}) {
    const jobId = `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const job = {
      id: jobId,
      name,
      data,
      attempts: 0,
      maxRetries: options.maxRetries || 3,
      createdAt: new Date()
    };

    this.queue.push(job);
    this.emit('jobAdded', job);

    // Process asynchronously on next tick
    setImmediate(() => this.processQueue());

    return job;
  }

  /**
   * Process pending items in the queue sequentially.
   */
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const job = this.queue.shift();

    const handler = this.jobs.get(job.name);
    if (!handler) {
      console.warn(`[QueueService] No registered worker found for job: ${job.name}`);
      this.isProcessing = false;
      return this.processQueue();
    }

    try {
      job.attempts++;
      console.log(`[QueueService] Executing job ${job.id} (${job.name}) [Attempt ${job.attempts}]`);
      await handler(job.data);
      this.emit('jobCompleted', job);
    } catch (error) {
      console.error(`[QueueService] Error executing job ${job.id}:`, error.message);
      if (job.attempts < job.maxRetries) {
        console.log(`[QueueService] Re-queueing job ${job.id} for retry.`);
        this.queue.push(job);
      } else {
        this.emit('jobFailed', { job, error });
      }
    } finally {
      this.isProcessing = false;
      this.processQueue();
    }
  }

  /**
   * Returns current queue statistics.
   */
  getStats() {
    return {
      pending: this.queue.length,
      registeredWorkers: Array.from(this.jobs.keys())
    };
  }
}

// Singleton instance export
const queueService = new QueueService();

export default queueService;
