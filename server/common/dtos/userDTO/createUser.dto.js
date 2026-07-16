class CreateUserDTO {
  constructor(user) {
    this.id = user.id; 
    this.first_name = user.first_name; 
    this.last_name = user.last_name; 
    this.username = user.username;
    this.email = user.email;
    this.phone = user.phone;
    this.country = user.country;
    this.password = user.password || null;
    this.user_background = user.user_background || null;
    this.experience = user.experience || null;
    this.investment_preferences = user.investment_preferences || [];
    this.id_nationality = user.idNationality || null;
    this.id_documents = user.id_documents || null;
    this.profile_image = user.profile_image || 'https://i.ibb.co/6WtQfMm/default.png';
    this.is_verified = user.is_verified; 
    this.is_active = user.is_active; 
    this.created_at = user.created_at; 
    this.updated_at = user.updated_at;
    this.id_document = user.id_document;
    this.languages = user.languages || [];
    this.interests = user.interests || [];
  }

  validate() {
    if (!this.first_name) throw new Error('First name is required');
    if (!this.last_name) throw new Error('Last name is required');
    if (!this.email) throw new Error('Email is required');
    
    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(this.email)) throw new Error('Invalid email format');
    
    if (!this.password) throw new Error('Password is required');
    if (!this.country) throw new Error('Country is required');

    if (!Array.isArray(this.investment_preferences)) {
      throw new Error('Investment preferences must be an array');
    }
    if (this.id_nationality && typeof this.id_nationality !== 'number') {
      throw new Error('Nationality ID must be a number');
    }
    
    // Optional: Validate phone number format if you expect a specific pattern
    if (this.phone && !/^\d{10,15}$/.test(this.phone)) throw new Error('Invalid phone number');
  }  
}

module.exports = { CreateUserDTO };
