const db = require('../config/db');

const GameInvitationModel = {
  // Crear una nueva invitación de juego
  async createInvitation(data) {
    const query = `
      INSERT INTO game_invitations (post_id, host_id, game_title, game_platform, game_date, max_participants)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      data.post_id,
      data.host_id,
      data.game_title,
      data.game_platform,
      data.game_date,
      data.max_participants || 10
    ];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  // Obtener todas las invitaciones activas
  async getAllInvitations() {
    const query = `
      SELECT * FROM game_invitations
      WHERE status = 'open'
      ORDER BY game_date ASC
    `;
    const { rows } = await db.query(query);
    return rows;
  },

  // Obtener una invitación por ID
  async getInvitationById(id) {
    const query = `SELECT * FROM game_invitations WHERE id = $1`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  // Actualizar una invitación
  async updateInvitation(id, data) {
    const query = `
      UPDATE game_invitations
      SET game_title = COALESCE($1, game_title),
          game_platform = COALESCE($2, game_platform),
          game_date = COALESCE($3, game_date),
          max_participants = COALESCE($4, max_participants),
          status = COALESCE($5, status)
      WHERE id = $6
      RETURNING *
    `;
    const values = [
      data.game_title,
      data.game_platform,
      data.game_date,
      data.max_participants,
      data.status,
      id
    ];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  // Eliminar invitación (cancelar)
  async deleteInvitation(id, host_id) {
    const query = `
      DELETE FROM game_invitations
      WHERE id = $1 AND host_id = $2
      RETURNING *
    `;
    const { rows } = await db.query(query, [id, host_id]);
    return rows[0];
  },

  // Unirse a una invitación
  async joinInvitation(invitation_id, user_id) {
    const query = `
      INSERT INTO game_invitation_participants (invitation_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (invitation_id, user_id) DO NOTHING
      RETURNING *
    `;
    const { rows } = await db.query(query, [invitation_id, user_id]);
    return rows[0];
  },

  // Actualizar estado de participación (aceptar/rechazar)
  async updateParticipantStatus(invitation_id, user_id, status) {
    const query = `
      UPDATE game_invitation_participants
      SET status = $1
      WHERE invitation_id = $2 AND user_id = $3
      RETURNING *
    `;
    const { rows } = await db.query(query, [status, invitation_id, user_id]);
    return rows[0];
  },

  // Obtener próximas invitaciones del usuario
  async getUpcomingInvitations(user_id) {
    const query = `
      SELECT gi.*
      FROM game_invitations gi
      JOIN game_invitation_participants gip ON gi.id = gip.invitation_id
      WHERE gip.user_id = $1 AND gi.game_date > NOW()
      ORDER BY gi.game_date ASC
    `;
    const { rows } = await db.query(query, [user_id]);
    return rows;
  }
};

module.exports = GameInvitationModel;
