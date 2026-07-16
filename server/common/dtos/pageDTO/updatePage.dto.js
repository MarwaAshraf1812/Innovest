class UpdatePageDTO {
  constructor(pageData) {
    this.title = pageData.title;
    this.content = pageData.content;
    this.location = pageData.location;
    this.images_url = pageData.images_url || [];
    this.page_url = pageData.page_url ;
    this.start_time = pageData.start_time;
    this.end_time = pageData.end_time;
    this.page_type = pageData.page_type;
    this.tags = pageData.tags || [];
  }

  validate() {
    if (!this.title && !this.content && !this.page_type && !this.location) {
      throw new Error('At least one field is required to update.');
    }
  }
}

module.exports = UpdatePageDTO;
