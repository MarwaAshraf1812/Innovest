import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useChatMessages } from '../features/chat/hooks/useChatMessages';
import { useSocket } from '../features/chat/hooks/useSocket';
import { ChatSidebar } from '../features/chat/components/ChatSidebar';
import { ChatWindow } from '../features/chat/components/ChatWindow';

export default function MessagesPage({
  initialContact = null,
  clearInitialContact = () => {},
  onViewProfile,
}) {
  const { currentUser } = useAuth();

  // 1. Initialize State & API Services
  const {
    contacts,
    selectedContact,
    setSelectedContact,
    messages,
    loadingContacts,
    loadingMessages,
    sendMessage,
    handleIncomingMessage,
  } = useChatMessages({
    currentUser,
    initialContact,
    clearInitialContact,
  });

  // 2. Initialize Real-Time WebSocket Channel
  const { typingUsers, sendTypingEvent } = useSocket({
    currentUserId: currentUser?.id || '',
    onMessageReceived: handleIncomingMessage,
  });

  return (
    <div className="flex h-full min-h-[500px] bg-white border-x-0 border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="flex w-full h-full divide-x divide-slate-100">
        
        {/* Contact list side panel */}
        <ChatSidebar
          contacts={contacts}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
          loading={loadingContacts}
          typingUsers={typingUsers}
        />

        {/* Selected conversation thread */}
        <ChatWindow
          selectedContact={selectedContact}
          messages={messages}
          currentUser={currentUser}
          loadingMessages={loadingMessages}
          onSendMessage={sendMessage}
          sendTypingEvent={sendTypingEvent}
          typingUsers={typingUsers}
          onViewProfile={onViewProfile}
        />

      </div>
    </div>
  );
}
export { MessagesPage };
