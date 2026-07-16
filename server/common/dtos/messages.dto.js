class MessageDTO {
    constructor(message_id, sender_id, receiver_id, content, created_at, updated_at) {
        this.message_id = message_id;        
        this.sender_id = sender_id;          
        this.receiver_id = receiver_id;    
        this.content = content;              
        this.created_at = created_at || new Date(); 
        this.updated_at = updated_at || new Date(); 
    }
}

class UpdatedMessageDTO {
    constructor(message_id, sender_id, receiver_id, content, updated_at) {
        this.message_id = message_id;        
        this.sender_id = sender_id || null;  
        this.receiver_id = receiver_id || null; 
        this.content = content || null;     
        this.updated_at = updated_at || new Date(); 
    }
}



module.exports = { MessageDTO, UpdatedMessageDTO };
