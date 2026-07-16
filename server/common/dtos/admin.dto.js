class CreateAdminDTO {
  constructor(data) {
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
    this.profile_image = data.profile_image;
    this.permissions = data.permissions || [];
}
}

class UpdateAdminDTO {
  constructor(data) {
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
    this.profile_image = data.profile_image;
    this.permissions = data.permissions || [];
  }
}

module.exports = { CreateAdminDTO, UpdateAdminDTO };
