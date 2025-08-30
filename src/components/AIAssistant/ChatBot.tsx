import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { ChatMessage } from '../../types';

export const ChatBot: React.FC = () => {
  const { chatMessages, setChatMessages, currentProject } = useAppContext();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setChatMessages([...chatMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        type: 'assistant',
        content: generateAIResponse(inputValue),
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('color') || lowerInput.includes('style')) {
      return "I can help you customize colors and styles! Select any element on the canvas, then use the Properties panel on the right to adjust colors, fonts, spacing, and more. You can also ask me specific questions like 'make the button blue' or 'change the text to be larger'.";
    }
    
    if (lowerInput.includes('database') || lowerInput.includes('backend')) {
      return "For backend and database setup, click the 'Database' button in the header. I can help you create tables, define relationships, and generate API endpoints. You can also describe what data you need to store and I'll suggest a schema structure.";
    }
    
    if (lowerInput.includes('deploy') || lowerInput.includes('publish')) {
      return "When you're ready to deploy, click the 'Deploy' button in the header. I'll generate all the necessary code and prepare it for deployment to platforms like Vercel or Netlify. Make sure to test your design first using the Preview button.";
    }
    
    if (lowerInput.includes('component') || lowerInput.includes('add')) {
      return "You can add components by dragging them from the left sidebar onto the canvas. Available components include buttons, text, inputs, containers, cards, and images. After adding a component, click on it to customize its properties.";
    }

    return "I'm here to help you build your website! I can assist with:\n\n• Styling and customizing components\n• Setting up your database structure\n• Generating and explaining code\n• Deployment guidance\n• General design advice\n\nWhat would you like to work on?";
  };

  const suggestedPrompts = [
    "How do I change the button color?",
    "Create a user registration form",
    "Set up a database for my blog",
    "Generate an API for user authentication"
  ];

  return (
    <div className="bg-gray-800 text-white h-full flex flex-col">
      <div className="flex items-center space-x-3 p-4 border-b border-gray-700">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">AI Assistant</h2>
          <p className="text-xs text-gray-400">Ask me anything about building your website</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="space-y-3">
            <div className="text-sm text-gray-400 mb-4">
              Try asking me something:
            </div>
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInputValue(prompt)}
                className="w-full text-left p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {chatMessages.map(message => (
          <div key={message.id} className="flex space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.type === 'user' ? 'bg-blue-600' : 'bg-purple-600'
            }`}>
              {message.type === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1">
              <div className="bg-gray-700 rounded-lg p-3">
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything about your project..."
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};