class CreateCommunityPagesDTO {
  constructor(data) {
    this.community_name = data.community_name;
    this.page_id = data.page_id;
    this.admin = data.admin;
    this.visibility = data.visibility !== undefined ? data.visibility : true;
  }

  validate() {
    if (!this.community_name) throw new Error('Community name is required');
    if (!this.page_id) throw new Error('Page ID is required');
  }
}

module.exports = CreateCommunityPagesDTO;

class UpdateCommunityPagesDTO {
  constructor(data) {
    this.community_name = data.community_name;
    this.page_id = data.page_id; /*  */
    this.admin = data.admin;
    this.visibility = data.visibility;
  }

  validate() {
    if (this.community_name && typeof this.community_name !== 'string')
      throw new Error('Invalid community name');
    if (this.page_id && typeof this.page_id !== 'string')
      throw new Error('Invalid page ID');
    if (this.visibility !== undefined && typeof this.visibility !== 'boolean')
      throw new Error('Invalid visibility');
  }
}

module.exports = UpdateCommunityPagesDTO;
