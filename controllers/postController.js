const PostModel = require('../models/postModel');

const PostController = {
  // Obtener feed de publicaciones
  async getPosts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      const userId = req.user ? req.user.id : null;
      
      const posts = await PostModel.getAllPosts(limit, offset, userId);
      
      res.status(200).json({
        success: true,
        count: posts.length,
        data: posts
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las publicaciones',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  },

  // Obtener publicación específica
  async getPostById(req, res) {
    try {
      const postId = req.params.id;
      const userId = req.user ? req.user.id : null;
      
      const post = await PostModel.getPostById(postId, userId);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Publicación no encontrada'
        });
      }
      
      res.status(200).json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la publicación',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  },

  // Crear nueva publicación
  async createPost(req, res) {
    try {
      // Los datos ya están validados por el middleware de validación
      const postData = {
        ...req.body,
        user_id: req.user.id
      };
      
      const post = await PostModel.createPost(postData);
      
      res.status(201).json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear la publicación',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  },

  // Actualizar publicación
  async updatePost(req, res) {
    try {
      const postId = req.params.id;
      
      // Los datos ya están validados por el middleware de validación
      const postData = {
        ...req.body,
        user_id: req.user.id
      };
      
      const updatedPost = await PostModel.updatePost(postId, postData);
      
      res.status(200).json({
        success: true,
        data: updatedPost
      });
    } catch (error) {
      console.error('Error updating post:', error);
      
      if (error.message === 'Post not found or not authorized') {
        return res.status(404).json({
          success: false,
          message: 'Publicación no encontrada o no autorizada'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error al actualizar la publicación',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  },

  // Eliminar publicación
  async deletePost(req, res) {
    try {
      const postId = req.params.id;
      const userId = req.user.id;
      
      const deletedPost = await PostModel.deletePost(postId, userId);
      
      res.status(200).json({
        success: true,
        message: 'Publicación eliminada correctamente',
        data: deletedPost
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      
      if (error.message === 'Post not found or not authorized') {
        return res.status(404).json({
          success: false,
          message: 'Publicación no encontrada o no autorizada'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error al eliminar la publicación',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  },

  // Añadir contenido multimedia a una publicación
  async addMedia(req, res) {
    try {
      const postId = req.params.id;
      
      // Los datos ya están validados por el middleware de validación
      
      // Verificar que el post exista y pertenezca al usuario
      const post = await PostModel.getPostById(postId);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Publicación no encontrada'
        });
      }
      
      if (post.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'No autorizado para modificar esta publicación'
        });
      }
      
      const mediaData = {
        media_url: req.body.media_url,
        media_type: req.body.media_type
      };
      
      const media = await PostModel.addMedia(postId, mediaData);
      
      res.status(201).json({
        success: true,
        data: media
      });
    } catch (error) {
      console.error('Error adding media:', error);
      res.status(500).json({
        success: false,
        message: 'Error al añadir contenido multimedia',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  },

  // Eliminar contenido multimedia
  async deleteMedia(req, res) {
    try {
      const postId = req.params.id;
      const mediaId = req.params.mediaId;
      const userId = req.user.id;
      
      const deletedMedia = await PostModel.deleteMedia(mediaId, postId, userId);
      
      res.status(200).json({
        success: true,
        message: 'Contenido multimedia eliminado correctamente',
        data: deletedMedia
      });
    } catch (error) {
      console.error('Error deleting media:', error);
      
      if (error.message === 'Media not found or not authorized') {
        return res.status(404).json({
          success: false,
          message: 'Contenido multimedia no encontrado o no autorizado'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error al eliminar contenido multimedia',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
      });
    }
  }
};

module.exports = PostController;