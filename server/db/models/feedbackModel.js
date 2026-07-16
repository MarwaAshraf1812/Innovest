const mongoose = require('mongoose');
const { Schema } = mongoose;

const feedbackSchema = new Schema({
  id: { type: String, default: uuidv4, unique: true },

  feedbacker_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  
  rate: { type: Number, min: 1, max: 5 },
  content: { type: String, required: true }
}, { timestamps: true });

// Creating the Feedback model
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
