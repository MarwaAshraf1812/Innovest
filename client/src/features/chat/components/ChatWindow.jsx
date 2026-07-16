import React from 'react';
import { MapPin, MessageSquare, Info } from 'lucide-react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export function ChatWindow({
  selectedContact,
  messages,
  currentUser,
  loadingMessages,
  onSendMessage,
  sendTypingEvent,
  typingUsers,
  onViewProfile,
}) {
  if (!selectedContact) {
    return (
      <div className="flex-1 bg-slate-50/30 flex flex-col items-center justify-center p-8 text-center gap-3">
        <div className="h-16 w-16 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-center text-primary-500">
          <MessageSquare className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-800">Your Inbox</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
            Select a followed contact or explore founders & investors to start a secure conversation.
          </p>
        </div>
      </div>
    );
  }

  const isTyping = !!typingUsers[selectedContact.id];

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      {/* Header info */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <button
            onClick={() => onViewProfile?.(selectedContact.id)}
            className="relative select-none border-none bg-transparent p-0 cursor-pointer"
          >
            {selectedContact.profile_image ? (
              <img
                src={selectedContact.profile_image}
                alt={selectedContact.first_name}
                className="h-10 w-10 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                {selectedContact.first_name?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
          </button>

          {/* Details */}
          <div>
            <button
              onClick={() => onViewProfile?.(selectedContact.id)}
              className="text-left border-none bg-transparent p-0 font-bold text-xs text-slate-800 hover:text-primary-600 hover:underline cursor-pointer flex items-center gap-1.5"
            >
              {selectedContact.first_name} {selectedContact.last_name}
              <Info className="h-3.5 w-3.5 text-slate-400 hover:text-primary-500" />
            </button>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] font-extrabold text-primary-600 bg-primary-50 px-2 py-0.5 rounded uppercase tracking-wider">
                {selectedContact.role}
              </span>
              {isTyping ? (
                <span className="text-[10px] text-primary-600 font-semibold italic animate-pulse">
                  typing...
                </span>
              ) : (
                <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-0.5">
                  <MapPin className="h-2.5 w-2.5" />
                  {selectedContact.country || 'Location N/A'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Shortcut */}
        <button
          onClick={() => onViewProfile?.(selectedContact.id)}
          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-650 rounded-lg text-[10px] font-bold border border-slate-200 transition-all cursor-pointer border-none"
        >
          View Profile
        </button>
      </div>

      {/* Messages */}
      {loadingMessages ? (
        <div className="flex-1 flex items-center justify-center bg-slate-50/50">
          <div className="h-6 w-6 rounded-full border-2 border-slate-200 border-t-primary-600 animate-spin" />
        </div>
      ) : (
        <MessageList
          messages={messages}
          selectedContact={selectedContact}
          currentUser={currentUser}
        />
      )}

      {/* Message Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        sendTypingEvent={(isTyping) => sendTypingEvent(selectedContact.id, isTyping)}
      />
    </div>
  );
}
