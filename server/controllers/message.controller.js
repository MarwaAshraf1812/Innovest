import Message from '../db/models/messagesModel.js';
import { v4 as uuidv4 } from 'uuid';
import { getIo } from '../config/socket.js';
import { User } from '../db/models/userModel.js';

class MessageController {
  async getConversation(req, res) {
    try {
      const userId = req.user.id;
      const { other_user_id } = req.params;

      const messages = await Message.find({
        $or: [
          { sender_id: userId, receiver_id: other_user_id },
          { sender_id: other_user_id, receiver_id: userId }
        ]
      }).sort({ created_at: 1 });

      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async sendMessage(req, res) {
    try {
      const userId = req.user.id;
      const { receiver_id, content } = req.body;
      if (!receiver_id || !content) {
        return res.status(400).json({ message: 'Receiver and content are required' });
      }

      const message = new Message({
        message_id: uuidv4(),
        sender_id: userId,
        receiver_id: receiver_id,
        content: content,
        created_at: new Date(),
        updated_at: new Date()
      });

      await message.save();

      // Emit through Socket.IO if possible
      try {
        getIo().to(receiver_id).emit('receiveMessage', message);
      } catch (err) {
        console.warn('Socket emit failed:', err.message);
      }

      return res.status(201).json(message);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getContacts(req, res) {
    try {
      const userId = req.user.id;
      
      // Fetch all verified users except current user
      const users = await User.find(
        { id: { $ne: userId }, is_verified: true },
        { password: 0, id_documents: 0 }
      ).lean();

      // Find last message for each contact to show preview
      const contactsWithLastMessage = await Promise.all(
        users.map(async (u) => {
          const lastMsg = await Message.findOne({
            $or: [
              { sender_id: userId, receiver_id: u.id },
              { sender_id: u.id, receiver_id: userId }
            ]
          }).sort({ created_at: -1 });

          return {
            ...u,
            lastMessage: lastMsg ? lastMsg.content : null,
            lastMessageTime: lastMsg ? lastMsg.created_at : null
          };
        })
      );

      // Sort contacts: those with messages first, ordered by message time desc
      contactsWithLastMessage.sort((a, b) => {
        if (a.lastMessageTime && b.lastMessageTime) {
          return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
        }
        if (a.lastMessageTime) return -1;
        if (b.lastMessageTime) return 1;
        return a.username.localeCompare(b.username);
      });

      return res.status(200).json(contactsWithLastMessage);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new MessageController();
