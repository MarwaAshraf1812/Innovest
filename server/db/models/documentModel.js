const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
   document_id: {type: String, required: true, default: mongoose.Types.ObjectId, unique: true},
   file_name: {type: String, required: true},
   file_url: {type: String, required: true},
   project_id: { type: String, ref: 'Project',  required: true},
}, { timestamps: true });

documentSchema.index({ project_id: 1 });


const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
