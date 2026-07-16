class CommunityUsersDTO {
    constructor(communityUser) {
        this.user_id = data.user_id;
        this.community_id = data.community_id;
        this.role = data.role;
    }
    validate() {
        if (!this.user_id) throw new Error('Interest userId is required ');
    }
}

class UpdateCommunityUsersDTO {
    constructor(data) {
        this.role = data.role;
        this.is_active = data.is_active;
        this.notification_preferences = data.notification_preferences;
    }
    validate() {
        if (!this.userId) throw new Error('Interest userId is required for updates');
    }
}


module.exports = { CommunityUsersDTO, UpdateCommunityUsersDTO };
