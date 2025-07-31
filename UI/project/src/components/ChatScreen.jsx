import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Trash2 } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { chatService } from '../services/chatService';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleSendMessage = async (question) => {
    const timestamp = formatTimestamp();
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      message: question,
      isUser: true,
      timestamp,
      fromCache: false
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatService.getAnswer(question);
      
      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        message: response.answer,
        isUser: false,
        timestamp: formatTimestamp(),
        fromCache: response.fromCache
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        message: error.message || 'Sorry, something went wrong. Please try again.',
        isUser: false,
        timestamp: formatTimestamp(),
        fromCache: false
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const clearCache = () => {
    chatService.clearCache();
    // Add system message about cache clearing
    const systemMessage = {
      id: Date.now(),
      message: 'Cache has been cleared. All future questions will fetch fresh responses.',
      isUser: false,
      timestamp: formatTimestamp(),
      fromCache: false
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Chat Assistant</h1>
              <p className="text-sm text-gray-500">Ask me anything!</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={clearCache}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              title="Clear cache"
            >
              Clear Cache
            </button>
            <button
              onClick={clearChat}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
              Clear Chat
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Welcome to Chat Assistant
              </h2>
              <p className="text-gray-600 mb-6">
                Ask questions about our article database below. 
                I can help you find information from our collection of articles.
                Your questions will be cached for faster responses!
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg.message}
                  isUser={msg.isUser}
                  fromCache={msg.fromCache}
                  timestamp={msg.timestamp}
                />
              ))}
              {isLoading && (
                <div className="flex gap-3 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatScreen;