const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const pageSchema = new mongoose.Schema({
  page_id: { type: String, default: uuidv4, unique: true },
  title: { type: String, required: true, maxlength: 500 },
  content: { type: String, required: true },
  location: { type: String, required: false },
  images_url: { type: [String], default: [] },
  page_url: { type: String },
  start_time: { type: Date, required: false },
  end_time: { type: Date, required: false },
  page_type: {
    type: String,
    enum: ['EVENT', 'ARTICLE', 'POST', 'PROJECT_INFO'],
  },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  tags: [{ type: String }],
  author: { type: String, ref: 'User'},
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
}
);

const Page = mongoose.model('Page', pageSchema);
module.exports = Page;
