class CreatePageDTO {
  constructor(pageData) {
    this.title = pageData.title;
    this.content = pageData.content;
    this.location = pageData.location;
    this.images_url = pageData.images_url || [];
    this.page_url = pageData.page_url;
    this.start_time = pageData.start_time;
    this.end_time = pageData.end_time;
    this.page_type = pageData.page_type;
    this.tags = pageData.tags || [];

    this.author = author;
    this.admin_id = admin_id;
  }

  validate() {
    if (!this.title || !this.content || !this.author || !this.admin_id) {
      throw new Error('Title, content, page_url, author, and admin_id are required fields.');
    }
  }
}

module.exports = CreatePageDTO;
