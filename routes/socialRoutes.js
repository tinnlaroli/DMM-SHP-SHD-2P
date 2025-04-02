const express = require("express");
const router = express.Router();
const socialController = require("../controllers/socialController");
const authMiddleware = require("../middlewares/authMiddleware");
const validation = require("../middlewares/validation");

// Aplicamos el middleware de autenticación a todas las rutas
//router.use(authMiddleware);

// Post interactions
router.post("/posts/:id/like",authMiddleware, socialController.likePost);
router.delete("/posts/:id/like",authMiddleware, socialController.unlikePost);
router.post("/posts/:id/favorite",authMiddleware, socialController.favoritePost);
router.delete("/posts/:id/favorite",authMiddleware, socialController.unfavoritePost);

// Comment interactions
router.get("/posts/:id/comments",authMiddleware, socialController.getComments);
router.post("/posts/:id/comments",authMiddleware, socialController.addComment);
router.put("/comments/:id",authMiddleware, socialController.updateComment);
router.delete("/comments/:id",authMiddleware, socialController.deleteComment);
router.post("/comments/:id/reply",authMiddleware, socialController.addReply);
router.post("/comments/:id/like",authMiddleware, socialController.likeComment);
router.delete("/comments/:id/like",authMiddleware, socialController.unlikeComment);

module.exports = router;
