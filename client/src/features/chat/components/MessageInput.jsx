import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

export function MessageInput({ onSendMessage, sendTypingEvent }) {
  const [content, setContent] = useState('');
  const typingTimeoutRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSendMessage(content.trim());
    setContent('');

    // Immediately stop typing indicator on message submission
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    sendTypingEvent(false);
  };

  const handleInputChange = (e) => {
    setContent(e.target.value);

    // Emit typing indicator
    sendTypingEvent(true);

    // Debounce stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingEvent(false);
    }, 2500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-slate-100 bg-white flex gap-2 items-center"
    >
      <input
        type="text"
        placeholder="Type a message..."
        value={content}
        onChange={handleInputChange}
        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-slate-400"
      />
      <button
        type="submit"
        disabled={!content.trim()}
        className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl h-9 w-9 flex items-center justify-center border-none cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
