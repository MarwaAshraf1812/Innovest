class UpdateUserDTO {
  constructor(user) {
    this.id = user.id; 
    this.username = user.username || null;
    this.first_name = user.first_name || null; 
    this.last_name = user.last_name || null; 
    this.email = user.email || null;
    this.password = user.password || null;
    this.phone = user.phone || null;
    this.country = user.country || null;
    this.user_background = user.user_background || null;
    this.experience = user.experience || null;
    this.investment_preferences = user.investment_preferences || [];
    this.id_nationality = user.id_nationality || null;
    this.id_documents = user.id_documents || null;
    this.profile_image = user.profile_image || null; 
    this.is_verified = user.is_verified !== undefined ? user.is_verified : null; 
    this.is_active = user.is_active !== undefined ? user.is_active : null; 
    this.updated_at = user.updated_at || null; 
    this.languages = user.languages || [];
    this.interests = user.interests || [];
  }

  validate() {
    if (!this.id) throw new Error('User ID is required for updates');

    // Validate email format if provided
    if (this.email) {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(this.email)) throw new Error('Invalid email format');
    }

    // Validate phone number format if provided
    if (this.phone && !/^\d{10,15}$/.test(this.phone)) throw new Error('Invalid phone number format');

    // Validate that investment_preferences is an array if provided
    if (this.investment_preferences && !Array.isArray(this.investment_preferences)) {
      throw new Error('Investment preferences must be an array');
    }

    // Validate that idNationality is a number if provided
    if (this.id_nationality && typeof this.id_nationality !== 'number') {
      throw new Error('Nationality ID must be a number');
    }
  }
}

module.exports = { UpdateUserDTO };
