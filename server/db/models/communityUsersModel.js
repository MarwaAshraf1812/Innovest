const mongoose = require('mongoose');

const CommunityUsersSchema = new mongoose.Schema({
    user_id: { type: String, ref: 'User', required: true },
    community_id: { type: String, ref: 'Community', required: true },
    member_status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    },
    role: { 
        type: String, 
        enum: ['MEMBER', 'ADMIN','SUPER_ADMIN'],
        default: 'MEMBER'
    },
    joined_at: { type: Date, default: Date.now },
    is_active: { type: Boolean, default: true },
    notification_preferences: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true }
    }
}, { timestamps: true });

CommunityUsersSchema.index({ community_id: 1, user_id: 1 }, { unique: true });

const CommunityUsers = mongoose.model('CommunityUsers', CommunityUsersSchema);
module.exports = CommunityUsers;