class CreateFeedbackDTO {
  constructor(feedback) {
    this.id = feedback.id;
    this.rate = feedback.rate || null;
    this.content = feedback.content;
    this.user_id = feedback.user_id;
    this.project_id = feedback.project_id;
    this.feedbacker_id = feedback.feedbacker_id || null;
    this.created_at = feedback.created_at;
    this.updated_at = feedback.updated_at;
  }

  validate() {
    if (!this.content) throw new Error('Content is required');
    if (!this.user_id) throw new Error('User ID is required');
    if (!this.project_id) throw new Error('Project ID is required');
  }
}

module.exports = { CreateFeedbackDTO };
