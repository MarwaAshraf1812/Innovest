
 class notificationDTO{
  constructor(notification){
    this.id=notification.id;
    this.content=notification.content;
    this.type=notification.type;
    this.read_status = notification.read_status;
    this.created_at = notification.created_at;
    this.updated_at = notification.updated_at;
    this.user_id = notification.user_id;
  }
  validate() {
    // Provide specific notification on missing required fields
    if (!this.name) throw new Error('Name is required');
  }

 }

 module.exports = notificationDTO;