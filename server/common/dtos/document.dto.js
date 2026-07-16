class DocumentDTO {
    constructor(document_id, file_name, file_url, project_id, created_at, updated_at) {
        this.document_id = document_id || null; 
        this.file_name = file_name;             
        this.file_url = file_url;               
        this.project_id = project_id;           
        this.created_at = created_at || new Date();  
        this.updated_at = updated_at || new Date();  
    }
}

class UpdatedDocumentDTO {
    constructor(document_id, file_name, file_url, project_id, updated_at) {
        this.document_id = document_id;    
        this.file_name = file_name || null; 
        this.file_url = file_url || null;       
        this.project_id = project_id || null;   
        this.updated_at = updated_at || new Date(); 
    }
}



module.exports = { DocumentDTO, UpdatedDocumentDTO };
