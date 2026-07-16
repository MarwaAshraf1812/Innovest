const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    comment_id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
        unique: true
    },
    user_id: { type: String, ref: 'User', required: true },
    page_id: { type: String, ref: 'Page', required: true },
    content: { type: String, required: true, maxlength: 1000 },
}, { timestamps: true });

CommentSchema.index({ user_id: 1, page_id: 1 });

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
