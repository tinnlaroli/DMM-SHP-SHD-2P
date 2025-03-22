const db = require("../config/db");

const PostModel = {
  // Obtener todas las publicaciones (feed)
  async getAllPosts(limit = 10, offset = 0, userId = null) {
    const query = `
      SELECT p.*, u.name as author_name, u.profile_picture as author_profile_picture,
              (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count,
              (SELECT COUNT(*) FROM favorites WHERE post_id = p.id) as favorite_count,
              (SELECT EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $3)) as is_liked,
              (SELECT EXISTS(SELECT 1 FROM favorites WHERE post_id = p.id AND user_id = $3)) as is_favorited
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await db.query(query, [limit, offset, userId || 0]);

    for (const post of result.rows) {
      const mediaQuery = `SELECT * FROM media WHERE post_id = $1`;
      const mediaResult = await db.query(mediaQuery, [post.id]);
      post.media = mediaResult.rows;
    }

    return result.rows;
  },

  // Obtener una publicación específica por ID
  async getPostById(postId, userId = null) {
    const query = `
      SELECT p.*, u.name as author_name, u.profile_picture as author_profile_picture,
              (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count,
              (SELECT COUNT(*) FROM favorites WHERE post_id = p.id) as favorite_count,
              (SELECT EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $2)) as is_liked,
              (SELECT EXISTS(SELECT 1 FROM favorites WHERE post_id = p.id AND user_id = $2)) as is_favorited
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `;
    const result = await db.query(query, [postId, userId || 0]);
    if (result.rows.length === 0) return null;

    const post = result.rows[0];
    const mediaQuery = `SELECT * FROM media WHERE post_id = $1`;
    const mediaResult = await db.query(mediaQuery, [postId]);
    post.media = mediaResult.rows;
    return post;
  },

  // Crear una nueva publicación
  async createPost(postData) {
    const query = `
      INSERT INTO posts(user_id, content, post_type, game_title, game_platform, game_date)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      postData.user_id,
      postData.content,
      postData.post_type,
      postData.game_title || null,
      postData.game_platform || null,
      postData.game_date || null,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  // Actualizar una publicación existente
  async updatePost(postId, postData) {
    const checkQuery = `SELECT * FROM posts WHERE id = $1 AND user_id = $2`;
    const checkResult = await db.query(checkQuery, [postId, postData.user_id]);
    if (checkResult.rows.length === 0) throw new Error("Post not found or not authorized");

    const updateQuery = `
      UPDATE posts
      SET content = COALESCE($1, content), post_type = COALESCE($2, post_type),
          game_title = COALESCE($3, game_title), game_platform = COALESCE($4, game_platform),
          game_date = COALESCE($5, game_date)
      WHERE id = $6
      RETURNING *
    `;
    const updateValues = [
      postData.content,
      postData.post_type,
      postData.game_title,
      postData.game_platform,
      postData.game_date,
      postId,
    ];
    const updateResult = await db.query(updateQuery, updateValues);
    return updateResult.rows[0];
  },

  // Eliminar una publicación
  async deletePost(postId, userId) {
    const checkQuery = `SELECT * FROM posts WHERE id = $1 AND user_id = $2`;
    const checkResult = await db.query(checkQuery, [postId, userId]);
    if (checkResult.rows.length === 0) throw new Error("Post not found or not authorized");

    const deleteQuery = `DELETE FROM posts WHERE id = $1 RETURNING *`;
    const deleteResult = await db.query(deleteQuery, [postId]);
    return deleteResult.rows[0];
  },

  // Añadir contenido multimedia a una publicación
  async addMedia(postId, mediaData) {
    const query = `
      INSERT INTO media(post_id, media_url, media_type)
      VALUES($1, $2, $3)
      RETURNING *
    `;
    const values = [postId, mediaData.media_url, mediaData.media_type];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  // Eliminar contenido multimedia
  async deleteMedia(mediaId, postId, userId) {
    const checkQuery = `
      SELECT m.* FROM media m
      JOIN posts p ON m.post_id = p.id
      WHERE m.id = $1 AND p.user_id = $2
    `;
    const checkResult = await db.query(checkQuery, [mediaId, userId]);
    if (checkResult.rows.length === 0) throw new Error("Media not found or not authorized");

    const deleteQuery = `DELETE FROM media WHERE id = $1 RETURNING *`;
    const deleteResult = await db.query(deleteQuery, [mediaId]);
    return deleteResult.rows[0];
  },
};

module.exports = PostModel;
