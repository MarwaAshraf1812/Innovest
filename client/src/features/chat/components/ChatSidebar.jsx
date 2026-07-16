import React, { useState } from 'react';
import { Search, User, MessageSquare } from 'lucide-react';

export function ChatSidebar({
  contacts,
  selectedContact,
  onSelectContact,
  loading,
  typingUsers,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = contacts.filter((c) =>
    `${c.first_name} ${c.last_name} ${c.username}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full md:w-80 border-r border-slate-200 bg-white flex flex-col h-full shrink-0">
      {/* Search Header */}
      <div className="p-4 border-b border-slate-100 space-y-3">
        <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary-600 animate-pulse" />
          Messages
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-50 p-2 space-y-1">
        {loading ? (
          <div className="flex flex-col gap-3 p-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-10 w-10 bg-slate-100 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                  <div className="h-2 bg-slate-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-2">
            <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
              <User className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold text-slate-700">No Chats Found</p>
            <p className="text-[10px] text-slate-400 max-w-[180px]">
              Follow profiles or initiate a direct chat to start sending messages.
            </p>
          </div>
        ) : (
          filtered.map((contact) => {
            const isSelected = selectedContact?.id === contact.id;
            const isTyping = !!typingUsers[contact.id];

            return (
              <button
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border-none text-left cursor-pointer ${
                  isSelected
                    ? 'bg-primary-50 text-primary-900 shadow-sm border border-primary-100/50'
                    : 'bg-transparent text-slate-700 hover:bg-slate-50'
                }`}
              >
                {/* Profile Image / Initials */}
                <div className="relative shrink-0 select-none">
                  {contact.profile_image ? (
                    <img
                      src={contact.profile_image}
                      alt={contact.first_name}
                      className="h-11 w-11 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {contact.first_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  {/* Status Indicator */}
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-xs font-bold truncate">
                      {contact.first_name} {contact.last_name}
                    </h4>
                    {contact.lastMessageTime && (
                      <span className="text-[9px] text-slate-400 font-medium shrink-0">
                        {new Date(contact.lastMessageTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-primary-600 font-semibold mb-0.5">@{contact.username}</p>
                  
                  {isTyping ? (
                    <p className="text-[10px] text-primary-600 font-semibold italic animate-bounce">
                      typing...
                    </p>
                  ) : (
                    <p className={`text-[10px] truncate ${
                      isSelected ? 'text-primary-700/80' : 'text-slate-500'
                    }`}>
                      {contact.lastMessage || 'Start a new conversation'}
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
