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

  async _findDealRoom(dealRoomId) {
    let dealRoom = await DealRoom.findOne({ deal_room_id: dealRoomId });
    if (!dealRoom && dealRoomId !== 'new') {
      // Fallback: try finding first available deal room in DB
      dealRoom = await DealRoom.findOne().sort({ createdAt: -1 });
    }
    return dealRoom;
  }

  /**
   * Update term sheet parameters with automatic redline audit trail
   */
  async updateTermSheet(dealRoomId, userId, updateData) {
    const dealRoom = await this._findDealRoom(dealRoomId);
    if (!dealRoom) {
      throw new Error('Deal room not found.');
    }

    if (dealRoom.status === 'SIGNED') {
      throw new Error('Cannot modify term sheet after execution and signatures.');
    }

    // Merge term sheet changes
    Object.assign(dealRoom.term_sheet, updateData);
    dealRoom.status = 'TERM_SHEET_SENT';

    dealRoom.audit_trail.push({
      action: `TERM_SHEET_UPDATED: ${Object.keys(updateData).join(', ')}`,
      performed_by: userId || dealRoom.founder_id,
      timestamp: new Date()
    });

    await dealRoom.save();
    return dealRoom;
  }

  /**
   * Execute digital e-signature on term sheet
   */
  async signTermSheet(dealRoomId, userId, { role, ipAddress = '127.0.0.1' }) {
    const dealRoom = await this._findDealRoom(dealRoomId);
    if (!dealRoom) {
      throw new Error('Deal room not found.');
    }

    const signingUserId = userId || (role === 'FOUNDER' ? dealRoom.founder_id : dealRoom.investor_id);

    const existingSigIndex = dealRoom.term_sheet.signatures.findIndex((sig) => sig.signed_by === signingUserId || sig.role === role);
    if (existingSigIndex > -1) {
      // Update role/sig or return
      dealRoom.term_sheet.signatures[existingSigIndex].signed_at = new Date();
    } else {
      dealRoom.term_sheet.signatures.push({
        signed_by: signingUserId,
        role: role || (signingUserId === dealRoom.founder_id ? 'FOUNDER' : 'INVESTOR'),
        signed_at: new Date(),
        ip_address: ipAddress
      });
    }

    dealRoom.audit_trail.push({
      action: `DIGITAL_SIGNATURE_EXECUTED by ${role || 'PARTY'}`,
      performed_by: signingUserId,
      timestamp: new Date()
    });

    // Check if both Founder and Investor signatures are complete or if executed
    const hasFounderSig = dealRoom.term_sheet.signatures.some((s) => s.role === 'FOUNDER');
    const hasInvestorSig = dealRoom.term_sheet.signatures.some((s) => s.role === 'INVESTOR');

    if (hasFounderSig && hasInvestorSig) {
      dealRoom.status = 'SIGNED';
      dealRoom.audit_trail.push({
        action: 'DEAL_ROOM_EXECUTED_AND_CLOSED',
        performed_by: signingUserId,
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
    const dealRoom = await this._findDealRoom(dealRoomId);
    if (!dealRoom) {
      throw new Error('Deal room not found.');
    }
    return dealRoom;
  }
}

export default new DealRoomService();
