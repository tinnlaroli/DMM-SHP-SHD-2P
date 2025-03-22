const Like = require("../models/likeModel");
const Favorite = require("../models/favoriteModel");
const Comment = require("../models/commentModel");
const Reply = require("../models/replyModel");
const CommentLike = require("../models/commentLikeModel");
const errorHandler = require("../utils/errorHandler");

const socialController = {
  // Like/Unlike posts
  async likePost(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const like = await Like.addLike(id, userId);
      
      res.status(201).json({
        success: true,
        message: "Post liked successfully",
        data: like
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
  
  async unlikePost(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const like = await Like.removeLike(id, userId);
      
      if (!like) {
        return res.status(404).json({
          success: false,
          message: "Like not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Post unliked successfully",
        data: like
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
  
  // Favorite/Unfavorite posts
  async favoritePost(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const favorite = await Favorite.addFavorite(id, userId);
      
      res.status(201).json({
        success: true,
        message: "Post marked as favorite",
        data: favorite
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
  
  async unfavoritePost(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const favorite = await Favorite.removeFavorite(id, userId);
      
      if (!favorite) {
        return res.status(404).json({
          success: false,
          message: "Favorite not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Post removed from favorites",
        data: favorite
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
  
  // Comments
  async getComments(req, res) {
    try {
      const { id } = req.params;
      
      const comments = await Comment.getComments(id);
      
      res.status(200).json({
        success: true,
        count: comments.length,
        data: comments
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
  
  async addComment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { content } = req.body;
      
      if (!content || content.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "Comment content is required"
        });
      }
      
      const comment = await Comment.addComment(id, userId, content);
      
      res.status(201).json({
        success: true,
        message: "Comment added successfully",
        data: comment
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
  
  async updateComment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { content } = req.body;
      
      if (!content || content.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "Comment content is required"
        });
      }
      
      const comment = await Comment.updateComment(id, userId, content);
      
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: "Comment not found or you don't have permission to update"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Comment updated successfully",
        data: comment
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
  
  async deleteComment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const comment = await Comment.deleteComment(id, userId);
      
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: "Comment not found or you don't have permission to delete"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
        data: comment
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
  
  // Comment replies
  async addReply(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { content } = req.body;
      
      if (!content || content.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "Reply content is required"
        });
      }
      
      const reply = await Reply.addReply(id, userId, content);
      
      res.status(201).json({
        success: true,
        message: "Reply added successfully",
        data: reply
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
  
  // Comment likes
  async likeComment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const like = await CommentLike.addCommentLike(id, userId);
      
      res.status(201).json({
        success: true,
        message: "Comment liked successfully",
        data: like
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
  
  async unlikeComment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const like = await CommentLike.removeCommentLike(id, userId);
      
      if (!like) {
        return res.status(404).json({
          success: false,
          message: "Comment like not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Comment unliked successfully",
        data: like
      });
    } catch (error) {
      errorHandler(res, error);
    }
  }
};

module.exports = socialController;