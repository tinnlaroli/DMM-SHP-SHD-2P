const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const userSettingModel = require("../models/userSettingModel");

const authController = {
  // Register a new user
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Create the user
      const newUser = await userModel.create({ name, email, password });

      // Create default settings for the user
      await userSettingModel.create(newUser.id);

      // Generate JWT token
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Return user info and token
      return res.status(201).json({
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
        token,
      });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  },

  // Login user with email and password
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Return user info and token
      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile_picture: user.profile_picture,
        },
        token,
      });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  },

  // Google login
  async googleLogin(req, res) {
    try {
      // In a real implementation, you would verify the Google token here
      // For this example, we'll assume the token is valid and contains user info
      const { name, email, googleId, profilePicture } = req.body;

      // Create or update user with Google info
      const user = await userModel.createOrUpdateWithSocial("google", {
        name,
        email,
        socialId: googleId,
        profilePicture,
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Return user info and token
      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile_picture: user.profile_picture,
        },
        token,
      });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  },

  // Facebook login
  async facebookLogin(req, res) {
    try {
      // In a real implementation, you would verify the Facebook token here
      // For this example, we'll assume the token is valid and contains user info
      const { name, email, facebookId, profilePicture } = req.body;

      // Create or update user with Facebook info
      const user = await userModel.createOrUpdateWithSocial("facebook", {
        name,
        email,
        socialId: facebookId,
        profilePicture,
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Return user info and token
      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile_picture: user.profile_picture,
        },
        token,
      });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  },

  // Get current user info
  async getCurrentUser(req, res) {
    try {
      const userId = req.user.id;

      // Get user details
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get user settings
      const settings = await userSettingModel.getByUserId(userId);

      // Return user info and settings
      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile_picture: user.profile_picture,
          bio: user.bio,
          game_preferences: user.game_preferences,
          created_at: user.created_at,
        },
        settings,
      });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  },

  // src/controllers/authController.js (update)
  // Add this method to the authController object:

  // Social login callback
  async socialLoginCallback(req, res) {
    try {
      // User is already authenticated by passport
      const user = req.user;

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
// aqui habra que cambiar para que en la app se redirija a la pantalla de inicio
// en lugar de mostrar el token en la pantalla
      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile_picture: user.profile_picture,
        },
        token,
      });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  },

  async updateCurrentUser(req, res) {
    try {
      const userId = req.user.id;
      const { name, bio, game_preferences, profile_picture } = req.body;

      // Update user information
      const updatedUser = await userModel.update(userId, {
        name,
        bio,
        game_preferences,
        profile_picture,
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return updated user info
      return res.status(200).json({
        id: updatedUser.id,
        name: updatedUser.name,
        profile_picture: updatedUser.profile_picture,
        bio: updatedUser.bio,
        game_preferences: updatedUser.game_preferences,
        created_at: updatedUser.created_at,
      });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  },

  // Logout (client-side only)
  logout(req, res) {
    return res.status(200).json({ message: "Logged out successfully" });
  },
};

module.exports = authController;
