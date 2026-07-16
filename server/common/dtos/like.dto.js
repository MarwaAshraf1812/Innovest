class LikeDTO {
    constructor(like) {
      this.like_id = like.like_id;
      this.content = like.content;
      this.created_at = like.created_at;
      this.user_id = like.user_id;
      this.post_id = like.post_id;
    }
  
    validate() {
        // Provide specific like on missing required fields
        if (!this.like_id) throw new Error('like_id is required.'); 
  }
}
  
  module.exports = LikeDTO;
  