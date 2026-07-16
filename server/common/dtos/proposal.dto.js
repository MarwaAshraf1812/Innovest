class proposalDTO {
  static fromRequest(proposalData){
    return {
      project_id: proposalData.project_id,
      investor_id: proposalData.investor_id,
      title: proposalData.title,
      amount_requested: proposalDataData.amount,
      milestones: proposalData.milestones,
      benefits: proposalData.benefits,
      terms: proposalData.terms,
      created_at: proposalData.created_at,
    };
  }

  static toResponse(proposalData) {
    return {
      project_id: proposalData.project_id,
      investor_id: proposalData.investor_id,
      title: proposalData.title,
      amount: proposalData.amount_requested,
      milestones: proposalData.milestones,
      benefits: proposalData.benefits,
      terms: proposalData.terms,
      status: proposalData.status,
      created_at: proposalData.created_at,
      updated_at: proposalData.updated_at,
    };
};
}

module.exports = proposalDTO;
