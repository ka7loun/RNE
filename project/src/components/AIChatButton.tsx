import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import ChatInterface from './ChatInterface';

const AIChatButton: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 group">
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Chat with AI Assistant
          {/* Tooltip arrow */}
          <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
        </div>
        
        {/* Chat button */}
        <button 
          onClick={() => setIsChatOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-transform duration-200 hover:scale-110"
          aria-label="Open AI Chat"
        >
          <Bot size={24} />
        </button>
      </div>

      {isChatOpen && <ChatInterface onClose={() => setIsChatOpen(false)} />}
    </>
  );
};

export default AIChatButton; 