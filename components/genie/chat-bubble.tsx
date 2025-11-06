'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Sparkles, ExternalLink } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  pageId?: string;
}

interface PageHistoryItem {
  id: string;
  query: string;
  timestamp: number;
}

interface ChatBubbleProps {
  onSendMessage: (message: string) => void;
  isGenerating?: boolean;
  messages?: ChatMessage[];
  pageHistory?: PageHistoryItem[];
}

export function ChatBubble({
  onSendMessage,
  isGenerating,
  messages = [],
  pageHistory = []
}: ChatBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current && isExpanded) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded]);

  const handleSend = () => {
    if (!message.trim() || isGenerating) return;
    onSendMessage(message);
    setMessage('');
  };

  const scrollToPage = (pageId: string) => {
    const pageElement = document.getElementById(pageId);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsExpanded(false);
    }
  };

  return (
    <>
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-[#00C8FF] hover:bg-[#00B8EF] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group"
          aria-label="Open BevGenie AI Chat"
        >
          <MessageCircle className="w-7 h-7 text-white" />
          {messages.length > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {messages.length}
            </div>
          )}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-[#0A1930] text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Ask BevGenie AI
          </div>
        </button>
      )}

      {isExpanded && (
        <div className="fixed bottom-6 right-6 w-[420px] h-[650px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-scale-in border border-gray-200">
          <div className="bg-[#0A1930] px-6 py-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00C8FF] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">BevGenie AI</h3>
                <p className="text-white/70 text-xs">
                  {isGenerating ? 'Generating page...' : 'Always here to help'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isGenerating && (
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Generating your page...</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#00C8FF] animate-pulse w-3/4" />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="font-semibold text-[#0A1930] mb-2">
                  Ask BevGenie Anything
                </h4>
                <p className="text-sm text-gray-600 mb-6">
                  Get instant insights about your beverage business
                </p>
                <div className="space-y-2">
                  {[
                    'Show me territory performance',
                    'How can I prove field ROI?',
                    'Analyze distributor attention'
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => {
                        setMessage(prompt);
                        setTimeout(() => handleSend(), 100);
                      }}
                      className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors border border-gray-200 shadow-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#00C8FF] text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.pageId && (
                    <button
                      onClick={() => scrollToPage(msg.pageId!)}
                      className={`mt-2 flex items-center gap-1 text-xs font-medium transition-colors ${
                        msg.role === 'user'
                          ? 'text-white hover:text-white/90'
                          : 'text-[#00C8FF] hover:text-[#00B8EF]'
                      }`}
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View Generated Page</span>
                    </button>
                  )}
                  <p className="text-xs opacity-60 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#00C8FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-[#00C8FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-[#00C8FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            {pageHistory.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="text-xs text-gray-500">Quick nav:</span>
                {pageHistory.slice(-3).map((page, idx) => (
                  <button
                    key={page.id}
                    onClick={() => scrollToPage(page.id)}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                  >
                    Page {pageHistory.length - 2 + idx}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask a question..."
                disabled={isGenerating}
                className="flex-1 px-4 py-3 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#00C8FF] disabled:opacity-50 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || isGenerating}
                className="px-4 py-3 bg-[#00C8FF] text-white rounded-xl hover:bg-[#00B8EF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
