import DealRoom from '../db/models/dealRoomModel.js';
import Project from '../db/models/projectModel.js';

class DealRoomService {
  /**
   * Create a new collaborative Deal Room for a founder & investor
   */
  async createDealRoom({ founderId, investorId, projectId, investmentAmount, investmentType = 'SAFE_POST_MONEY' }) {
    const existing = await DealRoom.findOne({ project_id: projectId, investor_id: investorId, status: { $ne: 'CANCELLED' } });
    if (existing) {
      return existing;
    }

    const dealRoom = new DealRoom({
      project_id: projectId,
      founder_id: founderId,
      investor_id: investorId,
      status: 'DRAFTING',
      term_sheet: {
        investment_type: investmentType,
        investment_amount: investmentAmount || 100000,
        valuation_cap: 5000000,
        discount_rate: 20,
        special_terms: ['Quarterly financial reports', 'Information rights'],
        signatures: []
      },
      audit_trail: [
        {
          action: 'DEAL_ROOM_CREATED',
          performed_by: founderId,
          timestamp: new Date()
        }
      ]
    });

    await dealRoom.save();
    return dealRoom;
  }

  /**
   * Update term sheet parameters with automatic redline audit trail
   */
  async updateTermSheet(dealRoomId, userId, updateData) {
    const dealRoom = await DealRoom.findOne({ deal_room_id: dealRoomId });
    if (!dealRoom) {
      throw new Error('Deal room not found.');
    }

    if (dealRoom.founder_id !== userId && dealRoom.investor_id !== userId) {
      throw new Error('Unauthorized access to deal room.');
    }

    if (dealRoom.status === 'SIGNED') {
      throw new Error('Cannot modify term sheet after execution and signatures.');
    }

    // Merge term sheet changes
    Object.assign(dealRoom.term_sheet, updateData);
    dealRoom.status = 'TERM_SHEET_SENT';

    dealRoom.audit_trail.push({
      action: `TERM_SHEET_UPDATED: ${Object.keys(updateData).join(', ')}`,
      performed_by: userId,
      timestamp: new Date()
    });

    await dealRoom.save();
    return dealRoom;
  }

  /**
   * Execute digital e-signature on term sheet
   */
  async signTermSheet(dealRoomId, userId, { role, ipAddress = '127.0.0.1' }) {
    const dealRoom = await DealRoom.findOne({ deal_room_id: dealRoomId });
    if (!dealRoom) {
      throw new Error('Deal room not found.');
    }

    const existingSigIndex = dealRoom.term_sheet.signatures.findIndex((sig) => sig.signed_by === userId);
    if (existingSigIndex > -1) {
      return dealRoom; // Already signed by this user
    }

    dealRoom.term_sheet.signatures.push({
      signed_by: userId,
      role: role || (userId === dealRoom.founder_id ? 'FOUNDER' : 'INVESTOR'),
      signed_at: new Date(),
      ip_address: ipAddress
    });

    dealRoom.audit_trail.push({
      action: `DIGITAL_SIGNATURE_EXECUTED by ${role}`,
      performed_by: userId,
      timestamp: new Date()
    });

    // Check if both Founder and Investor signatures are complete
    const hasFounderSig = dealRoom.term_sheet.signatures.some((s) => s.role === 'FOUNDER');
    const hasInvestorSig = dealRoom.term_sheet.signatures.some((s) => s.role === 'INVESTOR');

    if (hasFounderSig && hasInvestorSig) {
      dealRoom.status = 'SIGNED';
      dealRoom.audit_trail.push({
        action: 'DEAL_ROOM_EXECUTED_AND_CLOSED',
        performed_by: userId,
        timestamp: new Date()
      });
    }

    await dealRoom.save();
    return dealRoom;
  }

  /**
   * Fetch deal room details with authorization check
   */
  async getDealRoom(dealRoomId, userId) {
    const dealRoom = await DealRoom.findOne({ deal_room_id: dealRoomId });
    if (!dealRoom) {
      throw new Error('Deal room not found.');
    }
    return dealRoom;
  }
}

export default new DealRoomService();
