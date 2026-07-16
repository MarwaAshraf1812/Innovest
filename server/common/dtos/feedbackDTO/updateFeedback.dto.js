class UpdateFeedbackDTO {
  constructor(feedback) {
    this.id = feedback.id;
    this.rate = feedback.rate || null;
    this.content = feedback.content || null;
    this.user_id = feedback.user_id || null;
    this.project_id = feedback.project_id || null;
    this.feedbacker_id = feedback.feedbacker_id || null;
    this.updated_at = feedback.updated_at || null;
  }

  validate() {
    if (!this.id) throw new Error('Feedback ID is required for updates');
  }
}

module.exports = { UpdateFeedbackDTO };
