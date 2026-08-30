export class LikeDTO {
    constructor(like) {
      this.like_id = like.like_id;
      this.content = like.content;
      this.created_at = like.created_at;
      this.user_id = like.user_id;
      this.post_id = like.post_id;
    }
  
    validate() {
        if (!this.like_id) throw new Error('like_id is required.'); 
    }
}

export default LikeDTO;