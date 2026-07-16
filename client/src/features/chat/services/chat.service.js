import axios from 'axios';
import { API_URL } from '../../../config/api';

export const chatService = {
  /**
   * Retrieves message contact list with last message previews.
   */
  async getContacts() {
    const { data } = await axios.get(`${API_URL}/message/contacts`);
    return data || [];
  },

  /**
   * Retrieves conversation history with a specific contact user.
   */
  async getConversation(contactId) {
    const { data } = await axios.get(`${API_URL}/message/conversation/${contactId}`);
    return data || [];
  },

  /**
   * Sends a chat message to a contact user.
   */
  async sendMessage(receiverId, content) {
    const { data } = await axios.post(`${API_URL}/message`, {
      receiver_id: receiverId,
      content,
    });
    return data;
  },
};
