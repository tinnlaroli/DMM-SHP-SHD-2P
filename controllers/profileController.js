const userModel = require('../models/userModel');
const userSettingModel = require('../models/userSettingModel');
const userPlayTimeModel = require('../models/userPlayTimeModel');
const playTimePreferenceModel = require('../models/playTimePreferenceModel');

const profileController = {
  // Get complete profile
  async getProfile(req, res) {
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
      
      // Get user play time preferences
      const playTimes = await userPlayTimeModel.getByUserId(userId);
      
      // Return profile information
      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: req.user.id === userId ? user.email : undefined, // Only return email to the owner
        profile_picture: user.profile_picture,
        bio: user.bio,
        game_preferences: user.game_preferences,
        play_times: playTimes,
        created_at: user.created_at
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  },
  
  // Update profile
  async updateProfile(req, res) {
    try {
      const userId = req.params.id;
      
      // Check if user is updating their own profile
      if (req.user.id !== userId) {
        return res.status(403).json({ error: 'You can only update your own profile' });
      }
      
      const { name, bio, profile_picture } = req.body;
      
      // Update user information
      const updatedUser = await userModel.update(userId, {
        name,
        bio,
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
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  },
  
  // Get user's favorite games
  async getGames(req, res) {
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
      
      // Return game preferences
      return res.status(200).json({
        user_id: user.id,
        game_preferences: user.game_preferences || []
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  },
  
  // Add favorite game
  async addGame(req, res) {
    try {
      const userId = req.user.id;
      const { game } = req.body;
      
      if (!game) {
        return res.status(400).json({ error: 'Game title is required' });
      }
      
      // Get current user
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Add game to preferences if not already present
      let gamePreferences = user.game_preferences || [];
      
      if (!Array.isArray(gamePreferences)) {
        gamePreferences = [];
      }
      
      if (!gamePreferences.includes(game)) {
        gamePreferences.push(game);
        
        // Update user preferences
        const updatedUser = await userModel.update(userId, {
          game_preferences: gamePreferences
        });
        
        return res.status(200).json({
          user_id: updatedUser.id,
          game_preferences: updatedUser.game_preferences
        });
      } else {
        return res.status(400).json({ error: 'Game already in preferences' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  },
  
  // Remove favorite game
  async removeGame(req, res) {
    try {
      const userId = req.user.id;
      const gameId = req.params.gameId;
      
      // Get current user
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Remove game from preferences
      let gamePreferences = user.game_preferences || [];
      
      if (!Array.isArray(gamePreferences)) {
        return res.status(400).json({ error: 'No game preferences found' });
      }
      
      // Check if the game exists in the array by title or index
      let indexToRemove = -1;
      if (!isNaN(gameId)) {
        // If gameId is a number, interpret it as an array index
        indexToRemove = parseInt(gameId);
        if (indexToRemove < 0 || indexToRemove >= gamePreferences.length) {
          return res.status(404).json({ error: 'Game not found in preferences' });
        }
      } else {
        // Otherwise interpret it as the game title
        indexToRemove = gamePreferences.indexOf(gameId);
        if (indexToRemove === -1) {
          return res.status(404).json({ error: 'Game not found in preferences' });
        }
      }
      
      // Remove the game
      gamePreferences.splice(indexToRemove, 1);
      
      // Update user preferences
      const updatedUser = await userModel.update(userId, {
        game_preferences: gamePreferences
      });
      
      return res.status(200).json({
        user_id: updatedUser.id,
        game_preferences: updatedUser.game_preferences
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  },
  
  // Get user's play times
  async getPlayTimes(req, res) {
    try {
      const userId = req.params.id;
      
      // Get user
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
      
      // Get play times
      const playTimes = await userPlayTimeModel.getByUserId(userId);
      
      return res.status(200).json({
        user_id: Number(userId),
        play_times: playTimes
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  },
  
  // Add play time
  async addPlayTime(req, res) {
    try {
      const userId = req.user.id;
      const { play_time_id } = req.body;
      
      if (!play_time_id) {
        return res.status(400).json({ error: 'Play time ID is required' });
      }
      
      // Check if play time exists
      const playTime = await playTimePreferenceModel.getById(play_time_id);
      if (!playTime) {
        return res.status(404).json({ error: 'Play time preference not found' });
      }
      
      // Add play time for user
      const result = await userPlayTimeModel.add(userId, play_time_id);
      
      if (result.error) {
        return res.status(400).json({ error: result.error });
      }
      
      // Get updated play times
      const playTimes = await userPlayTimeModel.getByUserId(userId);
      
      return res.status(200).json({
        user_id: Number(userId),
        play_times: playTimes
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  },
  
  // Remove play time
  async removePlayTime(req, res) {
    try {
      const userId = req.user.id;
      const timeId = req.params.timeId;
      
      // Remove play time
      const removed = await userPlayTimeModel.remove(userId, timeId);
      
      if (!removed) {
        return res.status(404).json({ error: 'Play time not found for this user' });
      }
      
      // Get updated play times
      const playTimes = await userPlayTimeModel.getByUserId(userId);
      
      return res.status(200).json({
        user_id: Number(userId),
        play_times: playTimes
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = profileController;