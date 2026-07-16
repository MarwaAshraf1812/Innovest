const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    like_id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
        unique: true
    },
    user_id: { type: String, ref: 'User', required: true },
    page_id: { type: String, ref: 'Page', required: true },
}, { timestamps: true });

LikeSchema.index({ user_id: 1, page_id: 1 }, { unique: true });

const Like = mongoose.model('Like', LikeSchema);
module.exports = Like;
