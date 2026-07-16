const projectDTO = {
    toResponse: (project) => ({
        project_id: project.project_id,
        project_name: project.project_name,
        description: project.description,
        entrepreneur_id: project.entrepreneur_id,
        status: project.status,
        visibility: project.visibility,
        field: project.field,
        budget: project.budget,
        offer: project.offer,
        target: project.target,
        deadline: project.deadline,
        documents: project.documents,
        approved: project.approved,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
    }),
    fromRequest: (project) => ({
        project_name: project.project_name,
        description: project.description,
        status: project.status,
        visibility: project.visibility,
        entrepreneur_id: project.entrepreneur_id,
        field: project.field,
        budget: project.budget,
        offer: project.offer,
        target: project.target,
        deadline: project.deadline,
        documents: project.documents,
    })
}

module.exports = projectDTO;