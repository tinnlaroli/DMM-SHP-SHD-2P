const express = require("express");
const router = express.Router();
const socialController = require("../controllers/socialController");
const authMiddleware = require("../middlewares/authMiddleware");
const validation = require("../middlewares/validation");

// Aplicamos el middleware de autenticación a todas las rutas
//router.use(authMiddleware);

// Post interactions
router.post("/posts/:id/like", socialController.likePost);
router.delete("/posts/:id/like", socialController.unlikePost);
router.post("/posts/:id/favorite", socialController.favoritePost);
router.delete("/posts/:id/favorite", socialController.unfavoritePost);

// Comment interactions
router.get("/posts/:id/comments", socialController.getComments);
router.post("/posts/:id/comments", socialController.addComment);
router.put("/comments/:id", socialController.updateComment);
router.delete("/comments/:id", socialController.deleteComment);
router.post("/comments/:id/reply", socialController.addReply);
router.post("/comments/:id/like", socialController.likeComment);
router.delete("/comments/:id/like", socialController.unlikeComment);

module.exports = router;
