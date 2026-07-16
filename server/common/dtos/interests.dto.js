class CreateInterestDTO {
  constructor(interest) {
    this.id = interest.id;
    this.name = interest.name;
    this.admin_id = interest.admin_id;
    this.users = interest.users || [];
    this.created_at = interest.created_at;
    this.updated_at = interest.updated_at;
  }

  validate() {
    // Provide specific feedback on missing required fields
    if (!this.name) throw new Error('Name is required');
  }
}
class UpdateInterestDTO {
  constructor(interest) {
    this.id = interest._id;
    this.name = interest.name || null;
    this.admin_id = interest.admin_id || null;
    this.users = interest.users || [];
    this.updated_at = interest.updated_at || null;
  }

  validate() {
    if (!this.id) throw new Error('Interest ID is required for updates');
  }
}



module.exports = { CreateInterestDTO, UpdateInterestDTO };
