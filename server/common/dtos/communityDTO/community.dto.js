class CreateCommunityDTO {
    constructor(data) {
        this.community_name = data.community_name;
        this.description = data.description;
        this.image_url = data.image_url;
        this.admins = data.admins;
        this.tags = data.tags;
    }
}

class UpdateCommunityDTO {
    constructor(data) {
        this.community_name = data.community_name;
        this.description = data.description;
        this.image_url = data.image_url;
        this.admins = data.admins;
        this.tags = data.tags;
    }
}

module.exports = { CreateCommunityDTO, UpdateCommunityDTO };
