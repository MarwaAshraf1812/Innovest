export class CommentDTO {
    constructor(comment) {
      this.comment_id = comment.comment_id;
      this.content = comment.content;
      this.created_at = comment.created_at;
      this.user_id = comment.user_id;
      this.post_id = comment.post_id;
    }
  
    validate() {
        if (!this.content) throw new Error('content is required');
    }
}

export class UpdateCommentDTO {
    constructor(data) {
      this.content = data.content;  // Only content can be updated
    }
  
    validate() {
      if (!this.content) {
        throw new Error("Content is required to update the comment.");
      }
    }
}

export default { CommentDTO, UpdateCommentDTO };