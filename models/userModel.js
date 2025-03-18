const db = require('../config/db');
const bcrypt = require('bcrypt');

const userModel = {
  // Create a new user
  async create(userData) {
    const { name, email, password } = userData;
    
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
    `;
    
    const values = [name, email, passwordHash];
    
    const { rows } = await db.query(query, values);
    
    return rows[0];
  },
  
  // Find user by email
  async findByEmail(email) {
    const query = `
      SELECT id, name, email, password_hash, profile_picture, bio, game_preferences, created_at
      FROM users
      WHERE email = $1
    `;
    
    const { rows } = await db.query(query, [email]);
    
    return rows[0] || null;
  },
  
  // Find user by ID
  async findById(id) {
    const query = `
      SELECT id, name, email, profile_picture, bio, game_preferences, created_at
      FROM users
      WHERE id = $1
    `;
    
    const { rows } = await db.query(query, [id]);
    
    return rows[0] || null;
  },
  
  // Update user information
  async update(id, userData) {
    const { name, bio, game_preferences, profile_picture } = userData;
    
    const query = `
      UPDATE users
      SET name = COALESCE($1, name),
          bio = COALESCE($2, bio),
          game_preferences = COALESCE($3, game_preferences),
          profile_picture = COALESCE($4, profile_picture)
      WHERE id = $5
      RETURNING id, name, email, profile_picture, bio, game_preferences, created_at
    `;
    
    const values = [name, bio, game_preferences, profile_picture, id];
    
    const { rows } = await db.query(query, values);
    
    return rows[0] || null;
  },
  
  // Find user by social ID (Google or Facebook)
  async findBySocialId(provider, socialId) {
    const query = `
      SELECT id, name, email, profile_picture, bio, game_preferences, created_at
      FROM users
      WHERE ${provider}_id = $1
    `;
    
    const { rows } = await db.query(query, [socialId]);
    
    return rows[0] || null;
  },
  
  // Create or update user with social login
  async createOrUpdateWithSocial(provider, userData) {
    const { name, email, socialId, profilePicture } = userData;
    
    // Check if user exists with this email
    const existingUser = await this.findByEmail(email);
    
    if (existingUser) {
      // Update the social ID if not set
      const query = `
        UPDATE users
        SET ${provider}_id = $1, profile_picture = COALESCE($2, profile_picture)
        WHERE email = $3
        RETURNING id, name, email, profile_picture, bio, game_preferences, created_at
      `;
      
      const { rows } = await db.query(query, [socialId, profilePicture, email]);
      
      return rows[0];
    } else {
      // Create new user
      const query = `
        INSERT INTO users (name, email, ${provider}_id, profile_picture)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, profile_picture, created_at
      `;
      
      const values = [name, email, socialId, profilePicture];
      
      const { rows } = await db.query(query, values);
      
      return rows[0];
    }
  }
};

module.exports = userModel;