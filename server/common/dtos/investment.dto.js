class InvestmentDTO {
    constructor(invest_id, created_at, budget_amount, name, investor_id, project_id) {
        this.invest_id = invest_id;
        this.created_at = created_at;
        this.budget_amount = budget_amount;
        this.name = name;
        this.investor_id = investor_id;
        this.project_id = project_id;
    }
}

module.exports = InvestmentDTO;
