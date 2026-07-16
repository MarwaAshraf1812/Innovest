import { useState, useEffect, useCallback, useMemo } from 'react';
import { chatService } from '../services/chat.service';

export function useChatMessages({ currentUser, initialContact, clearInitialContact }) {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch contacts
  const fetchContacts = useCallback(async () => {
    try {
      setLoadingContacts(true);
      setError(null);
      const data = await chatService.getContacts();
      setContacts(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch contacts');
    } finally {
      setLoadingContacts(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      fetchContacts();
    }
  }, [currentUser?.id, fetchContacts]);

  // 2. Filter contacts: only show followed users OR users with a message history
  const filteredContacts = useMemo(() => {
    const followingIds = new Set(currentUser?.following || []);
    return contacts.filter((c) => {
      const isFollowed = followingIds.has(c.id);
      const hasHistory = !!c.lastMessage;
      return isFollowed || hasHistory;
    });
  }, [contacts, currentUser?.following]);

  // 3. Handle selection & initial contact routing
  useEffect(() => {
    if (initialContact && contacts.length > 0) {
      // Find if initialContact is in full contacts list
      const matched = contacts.find((c) => c.id === initialContact.id);
      if (matched) {
        setSelectedContact(matched);
      } else {
        // Construct temporary contact view if not already loaded
        const newContact = {
          ...initialContact,
          lastMessage: null,
          lastMessageTime: null,
        };
        // Add to state temporarily
        setContacts((prev) => [newContact, ...prev]);
        setSelectedContact(newContact);
      }
      clearInitialContact();
    }
  }, [initialContact, contacts, clearInitialContact]);

  // 4. Fetch conversation with selected contact
  const fetchConversation = useCallback(async (contactId) => {
    try {
      setLoadingMessages(true);
      setError(null);
      const data = await chatService.getConversation(contactId);
      setMessages(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch messages');
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (selectedContact?.id) {
      fetchConversation(selectedContact.id);
    } else {
      setMessages([]);
    }
  }, [selectedContact?.id, fetchConversation]);

  // 5. Send message
  const sendMessage = async (content) => {
    if (!selectedContact?.id || !content.trim()) return;

    try {
      // Create temporary local message for optimistic update
      const tempId = `temp-${Date.now()}`;
      const tempMsg = {
        message_id: tempId,
        sender_id: currentUser?.id || '',
        receiver_id: selectedContact.id,
        content: content.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Optimistic update messages stream
      setMessages((prev) => [...prev, tempMsg]);

      // Call API
      const sentMsg = await chatService.sendMessage(selectedContact.id, content.trim());

      // Replace optimistic message with server-confirmed message
      setMessages((prev) =>
        prev.map((msg) => (msg.message_id === tempId ? sentMsg : msg))
      );

      // Refresh contact list last message
      setContacts((prev) =>
        prev.map((c) =>
          c.id === selectedContact.id
            ? {
                ...c,
                lastMessage: sentMsg.content,
                lastMessageTime: sentMsg.created_at,
              }
            : c
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to send message');
      // Remove the failed optimistic message
      fetchConversation(selectedContact.id);
    }
  };

  // 6. Handle real-time incoming message insertion
  const handleIncomingMessage = useCallback(
    (message) => {
      const isFromActiveContact =
        message.sender_id === selectedContact?.id ||
        message.receiver_id === selectedContact?.id;

      if (isFromActiveContact) {
        setMessages((prev) => {
          // Avoid duplicate insertion
          if (prev.some((m) => m.message_id === message.message_id)) return prev;
          return [...prev, message];
        });
      }

      // Update contacts preview
      setContacts((prev) => {
        const sender = message.sender_id === currentUser?.id ? message.receiver_id : message.sender_id;
        return prev.map((c) =>
          c.id === sender
            ? {
                ...c,
                lastMessage: message.content,
                lastMessageTime: message.created_at,
              }
            : c
        );
      });
    },
    [selectedContact?.id, currentUser?.id]
  );

  return {
    contacts: filteredContacts,
    selectedContact,
    setSelectedContact,
    messages,
    loadingContacts,
    loadingMessages,
    error,
    sendMessage,
    handleIncomingMessage,
    refetchContacts: fetchContacts,
  };
}
