import path from 'path';

export const projectDTO = {
    toResponse: (project, isAuthorized = false) => {
        const cleanDocs = (project.documents || []).map(doc => path.basename(doc));
        const response = {
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
            approved: project.approved,
            has_documents: cleanDocs.length > 0,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        };

        if (isAuthorized) {
            response.documents = cleanDocs;
        }

        return response;
    },
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
        documents: (project.documents || []).map(doc => path.basename(doc)),
    })
};

export default projectDTO;