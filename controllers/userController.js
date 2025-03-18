const userModel = require('../models/userModel');
const userSettingModel = require('../models/userSettingModel');

const userController = {
  // Get user profile by ID
  async getUserProfile(req, res) {
    try {
      const userId = req.params.id;
      
      // Get user details
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Get user settings to check if profile is private
      const settings = await userSettingModel.getByUserId(userId);
      
      // If profile is private and the requesting user is not the profile owner
      if (settings && settings.private_profile && req.user.id !== userId) {
        return res.status(403).json({ error: 'This profile is private' });
      }
      
      // Return public user info
      return res.status(200).json({
        id: user.id,
        name: user.name,
        profile_picture: user.profile_picture,
        bio: user.bio,
        game_preferences: user.game_preferences,
        created_at: user.created_at
      });
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  },
  
  // Update current user profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name, bio, game_preferences, profile_picture } = req.body;
      
      // Update user information
      const updatedUser = await userModel.update(userId, {
        name,
        bio,
        game_preferences,
        profile_picture
      });
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Return updated user info
      return res.status(200).json({
        id: updatedUser.id,
        name: updatedUser.name,
        profile_picture: updatedUser.profile_picture,
        bio: updatedUser.bio,
        game_preferences: updatedUser.game_preferences,
        created_at: updatedUser.created_at
      });
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  },
  
  // Update user settings
  async updateSettings(req, res) {
    try {
      const userId = req.user.id;
      const { private_profile, notifications_enabled, theme, language, timezone } = req.body;
      
      // Update user settings
      const updatedSettings = await userSettingModel.update(userId, {
        private_profile,
        notifications_enabled,
        theme,
        language,
        timezone
      });
      
      if (!updatedSettings) {
        // If settings don't exist, create them
        const newSettings = await userSettingModel.create(userId);
        return res.status(200).json(newSettings);
      }
      
      // Return updated settings
      return res.status(200).json(updatedSettings);
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = userController;