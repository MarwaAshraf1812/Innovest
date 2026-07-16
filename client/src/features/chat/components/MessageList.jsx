import React, { useEffect, useRef } from 'react';

export function MessageList({ messages, selectedContact, currentUser }) {
  const bottomRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 gap-2">
          <div className="text-slate-300 font-black text-2xl select-none">👋</div>
          <p className="text-xs font-bold text-slate-800">Say Hello!</p>
          <p className="text-[10px] text-slate-400 max-w-[200px]">
            Send a direct message to start a conversation with {selectedContact.first_name}.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, index) => {
            const isMe = msg.sender_id === currentUser?.id;
            const msgTime = new Date(msg.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={msg.message_id || index}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
              >
                <div className={`flex gap-2 max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  {!isMe && (
                    <div className="shrink-0 select-none">
                      {selectedContact.profile_image ? (
                        <img
                          src={selectedContact.profile_image}
                          alt={selectedContact.first_name}
                          className="h-7 w-7 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-[10px] text-slate-600">
                          {selectedContact.first_name?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className="space-y-1">
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-primary-600 text-white rounded-tr-none'
                          : 'bg-white text-slate-800 border border-slate-200/60 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                    <div className={`text-[9px] text-slate-400 font-semibold px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                      {msgTime}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
