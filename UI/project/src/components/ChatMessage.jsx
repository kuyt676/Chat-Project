import React from 'react';
import { User, Bot } from 'lucide-react';

const ChatMessage = ({ message, isUser, fromCache, timestamp }) => {
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`px-4 py-2 rounded-lg ${
            isUser
              ? 'bg-blue-500 text-white ml-auto'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <span>{timestamp}</span>
          {fromCache && !isUser && (
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
              Cached
            </span>
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;