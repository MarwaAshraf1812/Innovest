import InvestorMandate from '../db/models/investorMandateModel.js';
import Project from '../db/models/projectModel.js';

class AIMatchmakingService {
  /**
   * Calculates Vector Similarity & Match Score between an Investor Mandate and a Project
   */
  calculateMatchScore(mandate, project) {
    if (!mandate || !project) {
      return { score: 50, match_highlights: ['Default baseline match score.'] };
    }

    const highlights = [];
    let sectorScore = 0;
    let budgetScore = 0;
    let geoScore = 0;
    let thesisScore = 0;

    // 1. Sector Alignment (35% Weight)
    const projectField = (project.field || '').toLowerCase();
    const preferredSectors = (mandate.preferred_sectors || []).map((s) => s.toLowerCase());

    const hasSectorMatch = preferredSectors.some(
      (sector) => projectField.includes(sector) || sector.includes(projectField)
    );

    if (hasSectorMatch) {
      sectorScore = 100;
      highlights.push(`High Sector Alignment: Project field '${project.field}' matches investor mandate.`);
    } else if (preferredSectors.length === 0) {
      sectorScore = 70; // Agnostic
    } else {
      sectorScore = 30; // Partial cross-sector potential
    }

    // 2. Budget & Check Size Compatibility (30% Weight)
    const projectBudget = project.budget || project.target || 0;
    const minCheck = mandate.min_check_size || 0;
    const maxCheck = mandate.max_check_size || Infinity;

    if (projectBudget >= minCheck && projectBudget <= maxCheck) {
      budgetScore = 100;
      highlights.push(`Ideal Funding Target: $${projectBudget.toLocaleString()} check size is within target range.`);
    } else if (projectBudget < minCheck) {
      budgetScore = 60;
      highlights.push(`Check size $${projectBudget.toLocaleString()} is below investor minimum.`);
    } else {
      budgetScore = 50;
      highlights.push(`Check size $${projectBudget.toLocaleString()} exceeds investor max single check limit.`);
    }

    // 3. Geographic Alignment (15% Weight)
    const projectLocation = (project.location || 'Egypt').toLowerCase();
    const targetCountries = (mandate.target_countries || []).map((c) => c.toLowerCase());

    if (targetCountries.length === 0 || targetCountries.includes('global') || targetCountries.some((c) => projectLocation.includes(c))) {
      geoScore = 100;
      highlights.push(`Geographic Focus Match: ${project.location || 'Egypt'}`);
    } else {
      geoScore = 40;
    }

    // 4. Thesis & Description Vector Keyword Match (20% Weight)
    const thesisText = (mandate.investment_thesis || '').toLowerCase();
    const descriptionText = (project.description || '').toLowerCase();

    if (thesisText && descriptionText) {
      const thesisWords = thesisText.split(/\W+/).filter((w) => w.length > 3);
      const matchedWords = thesisWords.filter((word) => descriptionText.includes(word));
      if (matchedWords.length > 0) {
        thesisScore = Math.min(100, 50 + matchedWords.length * 20);
        highlights.push(`Thesis Keyword Overlap: Matched terms (${matchedWords.slice(0, 3).join(', ')})`);
      } else {
        thesisScore = 60;
      }
    } else {
      thesisScore = 70;
    }

    // Calculate final weighted score
    const finalScore = Math.round(
      sectorScore * 0.35 + budgetScore * 0.30 + geoScore * 0.15 + thesisScore * 0.20
    );

    return {
      match_score: Math.min(99, Math.max(25, finalScore)),
      match_breakdown: {
        sector_score: sectorScore,
        budget_score: budgetScore,
        geo_score: geoScore,
        thesis_score: thesisScore
      },
      match_highlights: highlights
    };
  }

  /**
   * Fetch personalized AI-matched deal flow feed for an investor
   */
  async getPersonalizedDealFlow(investorId, { page = 1, limit = 10 }) {
    const mandate = await InvestorMandate.findOne({ investor_id: investorId });
    const approvedProjects = await Project.find({ approved: 'approved' }).lean();

    const scoredProjects = approvedProjects.map((project) => {
      const matchResult = this.calculateMatchScore(mandate, project);
      return {
        ...project,
        ai_match: matchResult
      };
    });

    // Sort descending by match score
    scoredProjects.sort((a, b) => b.ai_match.match_score - a.ai_match.match_score);

    // Pagination slice
    const startIndex = (page - 1) * limit;
    const paginatedProjects = scoredProjects.slice(startIndex, startIndex + limit);

    return {
      total_projects: scoredProjects.length,
      page,
      limit,
      deal_flow: paginatedProjects
    };
  }

  /**
   * Create or update investor mandate
   */
  async upsertInvestorMandate(investorId, mandateData) {
    let mandate = await InvestorMandate.findOne({ investor_id: investorId });
    if (!mandate) {
      mandate = new InvestorMandate({ investor_id: investorId, ...mandateData });
    } else {
      Object.assign(mandate, mandateData);
    }
    await mandate.save();
    return mandate;
  }
}

export default new AIMatchmakingService();
