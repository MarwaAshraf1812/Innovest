class UserDTO {
  constructor(user) {
    this.id = user.id; 
    this.username = user.username;
    this.first_name = user.first_name; 
    this.last_name = user.last_name; 
    this.email = user.email;
    this.phone = user.phone;
    this.country = user.country;
    this.user_background = user.user_background || null;
    this.experience = user.experience || null;
    this.investment_preferences = user.investment_preferences || [];
    this.id_nationality = user.id_nationality || null;
    this.id_documents = user.id_documents || null;
    this.profile_image = user.profile_image || 'https://i.ibb.co/6WtQfMm/default.png'; 
    this.is_verified = user.is_verified; 
    this.is_active = user.is_active; 
    this.created_at = user.created_at; 
    this.updated_at = user.updated_at; 
    this.languages = user.languages || [];
    this.interests = user.interests || [];
  }
}

module.exports = { UserDTO };
