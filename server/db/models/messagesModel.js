const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message_id: { type: String, required: true, unique: true  },
    sender_id: { type: String, required: true },
    receiver_id: {  type: String,  required: true },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    
    content: { type: String, required: true }
});

// Create a model
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
