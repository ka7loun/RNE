import React, { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
}

const initialOptions = [
  {
    label: "Vérifier le nom de l'entreprise / التحقق من اسم المؤسسة",
    value: "name_check"
  },
  {
    label: "Poser une question / اطرح سؤالا",
    value: "faq"
  }
];

// Helper to render assistant messages with formatting
function renderAssistantMessage(text: string) {
  // Parse status, message, and suggestions
  const statusMatch = text.match(/^Status: (\w+)\n([\s\S]*)/);
  let status = null, rest = text;
  if (statusMatch) {
    status = statusMatch[1];
    rest = statusMatch[2];
  }
  const [mainMsg, suggestionsBlock] = rest.split('\n\nSuggestions:\n');
  const suggestions = suggestionsBlock ? suggestionsBlock.split('\n') : [];

  // Status badge color
  let badgeColor = 'bg-gray-400';
  if (status === 'available' || status === 'answered') badgeColor = 'bg-green-500';
  else if (status === 'taken' || status === 'invalid' || status === 'error') badgeColor = 'bg-red-500';
  else if (status === 'fallback') badgeColor = 'bg-yellow-500';

  return (
    <div>
      {status && (
        <span className={`inline-block px-2 py-1 mb-1 rounded text-xs font-bold text-white ${badgeColor}`}>
          {status.toUpperCase()}
        </span>
      )}
      <div className="mb-1 whitespace-pre-line font-medium text-gray-800">{mainMsg}</div>
      {suggestions.length > 0 && (
        <ul className="list-disc list-inside bg-blue-50 rounded p-2 mt-1">
          {suggestions.map((s, i) => (
            <li key={i} className="text-sm text-blue-900 font-semibold">{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

const ChatInterface: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showOptions, setShowOptions] = useState(true);

  const handleSend = async (text?: string) => {
    const messageToSend = text !== undefined ? text : inputText;
    if (messageToSend.trim()) {
      setMessages([...messages, { text: messageToSend, isUser: true }]);
      setInputText('');
      setShowOptions(false);

      // Determine mode
      let mode = null;
      if (messageToSend === "name_check") mode = "name_check";
      if (messageToSend === "faq") mode = "faq";

      // If the user clicked a mode button, just show the prompt
      if (mode) {
        setMessages(prev => [...prev, {
          text: mode === "name_check"
            ? "Entrez le nom à vérifier / أدخل الاسم للتحقق"
            : "Posez votre question / اطرح سؤالك",
          isUser: false
        }]);
        return;
      }

      // Find the last mode in the messages
      let lastMode = null;
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].text === "name_check") { lastMode = "name_check"; break; }
        if (messages[i].text === "faq") { lastMode = "faq"; break; }
      }
      if (!lastMode) lastMode = "faq"; // default

      // Call the API
      let response;
      try {
        if (lastMode === "name_check") {
          response = await fetch('http://192.168.4.154:8000/api/name_check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: messageToSend,
              business_type: 'DENOMINATION_SOCIALE',
              lang: 'fr'
            })
          });
        } else {
          response = await fetch('http://192.168.4.154:8000/api/faq', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              question: messageToSend,
              lang: 'fr'
            })
          });
        }
        const data = await response.json();
        let fullMessage = data.message;
        if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          fullMessage += "\n\nSuggestions:\n" + data.suggestions.join('\n');
        }
        if (data.status) {
          fullMessage = `Status: ${data.status}\n${fullMessage}`;
        }
        setMessages(prev => [...prev, {
          text: fullMessage,
          isUser: false
        }]);
      } catch (e) {
        setMessages(prev => [...prev, {
          text: "Connection error. Please try again.",
          isUser: false
        }]);
      }
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-blue-600" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.isUser
                ? message.text
                : renderAssistantMessage(message.text)
              }
            </div>
          </div>
        ))}
        {showOptions && (
          <div className="flex flex-col gap-3">
            {initialOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleSend(option.value)}
                className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-4 rounded transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          autoComplete="off"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-blue-500"
              disabled={showOptions}
              autoComplete="off"
            />
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              disabled={showOptions}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface; 