import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { ChatMessage, MessageRole } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

const AIConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: MessageRole.MODEL, text: "Hello. I am Virtuous Model's AI booking assistant. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: MessageRole.USER, text: userMsg }]);
    setIsLoading(true);

    const aiResponseText = await sendMessageToGemini(userMsg);

    setMessages(prev => [...prev, { role: MessageRole.MODEL, text: aiResponseText }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-40 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 ${
          isOpen ? 'bg-gray-200 text-black rotate-90' : 'bg-black text-white'
        }`}
        aria-label="Toggle AI Concierge"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 md:right-8 w-80 md:w-96 bg-white shadow-2xl border border-gray-100 rounded-lg overflow-hidden z-40 transition-all duration-300 origin-bottom-right transform ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-black text-white p-4 flex items-center gap-3">
          <div className="bg-gray-700 p-1.5 rounded-full">
            <Sparkles size={16} className="text-yellow-200" />
          </div>
          <div>
            <h3 className="font-serif text-lg leading-none">Concierge AI</h3>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">Powered by Gemini</span>
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 text-sm rounded-2xl ${
                  msg.role === MessageRole.USER
                    ? 'bg-black text-white rounded-br-none'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about rates, availability..."
            className="flex-1 bg-gray-100 text-sm px-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-black text-white rounded-full disabled:opacity-50 hover:bg-gray-800 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
};

export default AIConcierge;