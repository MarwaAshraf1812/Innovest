import dealRoomService from '../services/deal_room.service.js';
import Project from '../db/models/projectModel.js';

class DealRoomController {
  /**
   * POST /api/deal-room
   * Create or initialize a collaborative Deal Room
   */
  async createDealRoom(req, res) {
    try {
      const { project_id, investor_id, investment_amount, investment_type } = req.body;
      const userId = req.user.id;

      const project = await Project.findOne({ project_id });
      if (!project) {
        return res.status(404).json({ error: 'Project not found.' });
      }

      const dealRoom = await dealRoomService.createDealRoom({
        founderId: project.entrepreneur_id,
        investorId: investor_id || userId,
        projectId: project_id,
        investmentAmount: investment_amount,
        investmentType: investment_type
      });

      return res.status(201).json({ message: 'Deal room created successfully', dealRoom });
    } catch (error) {
      console.error('Create Deal Room Error:', error);
      return res.status(500).json({ error: 'Failed to create deal room.' });
    }
  }

  /**
   * PUT /api/deal-room/:deal_room_id/term-sheet
   * Update term sheet parameters with automatic redline audit trail
   */
  async updateTerms(req, res) {
    try {
      const { deal_room_id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      const updatedDealRoom = await dealRoomService.updateTermSheet(deal_room_id, userId, updateData);
      return res.status(200).json({ message: 'Term sheet updated', dealRoom: updatedDealRoom });
    } catch (error) {
      console.error('Update Term Sheet Error:', error);
      return res.status(400).json({ error: error.message || 'Failed to update term sheet.' });
    }
  }

  /**
   * POST /api/deal-room/:deal_room_id/sign
   * Execute digital e-signature on term sheet
   */
  async signTerms(req, res) {
    try {
      const { deal_room_id } = req.params;
      const userId = req.user?.id || 'demo-user-id';
      const { role } = req.body;
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

      const signedDealRoom = await dealRoomService.signTermSheet(deal_room_id, userId, { role, ipAddress });
      return res.status(200).json({ message: 'Digital signature executed successfully', dealRoom: signedDealRoom });
    } catch (error) {
      console.error('Sign Term Sheet Error:', error);
      return res.status(400).json({ error: error.message || 'Failed to execute digital signature.' });
    }
  }

  /**
   * GET /api/deal-room/:deal_room_id
   * Get deal room details and audit trail
   */
  async getDealRoom(req, res) {
    try {
      const { deal_room_id } = req.params;
      const userId = req.user.id;

      const dealRoom = await dealRoomService.getDealRoom(deal_room_id, userId);
      return res.status(200).json(dealRoom);
    } catch (error) {
      console.error('Get Deal Room Error:', error);
      return res.status(500).json({ error: 'Failed to retrieve deal room details.' });
    }
  }
}

export default new DealRoomController();
