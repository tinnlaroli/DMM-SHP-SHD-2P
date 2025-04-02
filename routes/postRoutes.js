const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  validateCreatePost,
  validateUpdatePost,
  validateMedia,
  validateIdParam,
  validateMediaIdParam,
} = require("../middlewares/validation");

// Rutas públicas
router.get("/", postController.getPosts);
router.get("/:id", validateIdParam, postController.getPostById);

// Rutas protegidas - requieren autenticación
router.post(
  "/",
  
  validateCreatePost,
  postController.createPost
);

router.put(
  "/:id",
  
  validateIdParam,
  validateUpdatePost,
  postController.updatePost
);

router.delete(
  "/:id",
  
  validateIdParam,
  postController.deletePost
);

// Rutas para manejo de contenido multimedia
router.post(
  "/:id/media",
  
  validateIdParam,
  validateMedia,
  postController.addMedia
);

router.delete(
  "/:id/media/:mediaId",
  
  validateIdParam,
  validateMediaIdParam,
  postController.deleteMedia
);

module.exports = router;