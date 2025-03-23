const GameInvitationModel = require('../models/gameInvitationModel');

const GameInvitationController = {
  // Obtener todas las invitaciones de juego
  async getAll(req, res) {
    try {
      const invitations = await GameInvitationModel.getAllInvitations();
      res.status(200).json({ success: true, data: invitations });
    } catch (error) {
      console.error('Error fetching invitations:', error);
      res.status(500).json({ success: false, message: 'Error al obtener invitaciones' });
    }
  },

  // Crear una nueva invitación de juego
  async create(req, res) {
    try {
      const { post_id, game_title, game_platform, game_date, max_participants } = req.body;
      const host_id = req.user.id;
      const invitation = await GameInvitationModel.createInvitation({
        post_id,
        host_id,
        game_title,
        game_platform,
        game_date,
        max_participants
      });
      res.status(201).json({ success: true, data: invitation });
    } catch (error) {
      console.error('Error creating invitation:', error);
      res.status(500).json({ success: false, message: 'Error al crear invitación' });
    }
  },

  // Ver detalles de una invitación
  async getById(req, res) {
    try {
      const id = req.params.id;
      const invitation = await GameInvitationModel.getInvitationById(id);
      if (!invitation) return res.status(404).json({ success: false, message: 'Invitación no encontrada' });
      res.status(200).json({ success: true, data: invitation });
    } catch (error) {
      console.error('Error fetching invitation:', error);
      res.status(500).json({ success: false, message: 'Error al obtener invitación' });
    }
  },

  // Actualizar invitación
  async update(req, res) {
    try {
      const id = req.params.id;
      const updated = await GameInvitationModel.updateInvitation(id, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error('Error updating invitation:', error);
      res.status(500).json({ success: false, message: 'Error al actualizar invitación' });
    }
  },

  // Eliminar invitación
  async remove(req, res) {
    try {
      const id = req.params.id;
      const host_id = req.user.id;
      const deleted = await GameInvitationModel.deleteInvitation(id, host_id);
      if (!deleted) return res.status(403).json({ success: false, message: 'No autorizado o invitación no encontrada' });
      res.status(200).json({ success: true, message: 'Invitación cancelada correctamente' });
    } catch (error) {
      console.error('Error deleting invitation:', error);
      res.status(500).json({ success: false, message: 'Error al cancelar invitación' });
    }
  },

  // Unirse a una invitación
  async join(req, res) {
    try {
      const user_id = req.user.id;
      const invitation_id = req.params.id;
      const joined = await GameInvitationModel.joinInvitation(invitation_id, user_id);
      if (!joined) return res.status(200).json({ success: true, message: 'Ya estás unido a esta invitación' });
      res.status(201).json({ success: true, data: joined });
    } catch (error) {
      console.error('Error joining invitation:', error);
      res.status(500).json({ success: false, message: 'Error al unirse a la invitación' });
    }
  },

  // Aceptar o rechazar invitación
  async updateStatus(req, res) {
    try {
      const user_id = req.user.id;
      const invitation_id = req.params.id;
      const { status } = req.body; // 'accepted' o 'declined'
      const updated = await GameInvitationModel.updateParticipantStatus(invitation_id, user_id, status);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ success: false, message: 'Error al actualizar el estado de participación' });
    }
  },

  // Ver próximas citas de juego
  async getUpcoming(req, res) {
    try {
      const user_id = req.user.id;
      const upcoming = await GameInvitationModel.getUpcomingInvitations(user_id);
      res.status(200).json({ success: true, data: upcoming });
    } catch (error) {
      console.error('Error fetching upcoming invitations:', error);
      res.status(500).json({ success: false, message: 'Error al obtener citas próximas' });
    }
  }
};

module.exports = GameInvitationController;