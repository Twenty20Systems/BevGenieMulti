'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, RotateCcw, MessageCircle, ChevronDown } from 'lucide-react';
import { COLORS } from '@/lib/constants/colors';
import type { DynamicPageData } from '@/hooks/useChat';

interface ChatBubbleProps {
  messages: DynamicPageData[];
  isLoading: boolean;
  generationStatus: {
    progress: number;
    stageName: string;
    isGeneratingPage: boolean;
  };
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  onOpenFullScreen: () => void;
}

/**
 * Chat Bubble Component
 *
 * Displays as:
 * - Minimized: Circular navy bubble with cyan accent (bottom-right)
 * - Expanded: White card with chat history and input
 *
 * Design: Matches homepage aesthetic (premium B2B SaaS)
 */
export function ChatBubble({
  messages,
  isLoading,
  generationStatus,
  onSendMessage,
  onClearChat,
  onOpenFullScreen,
}: ChatBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      // Open full screen after first message
      if (messages.length === 0) {
        setTimeout(() => {
          onOpenFullScreen();
        }, 100);
      }
    }
  };

  // Minimized state - circular bubble
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 z-40 transition-all duration-300 hover:scale-110"
        title="Open chat"
      >
        <div
          className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-2xl relative overflow-hidden group"
          style={{
            backgroundColor: COLORS.navy,
            border: `3px solid ${COLORS.cyan}`,
          }}
        >
          {/* Animated cyan glow on hover */}
          <div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              backgroundColor: COLORS.cyan,
              filter: 'blur(12px)',
            }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center">
            <MessageCircle className="w-7 h-7" />
          </div>

          {/* Message count badge */}
          {messages.length > 0 && (
            <div
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center shadow-lg"
              style={{ backgroundColor: COLORS.cyan }}
            >
              {messages.length}
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div
              className="absolute inset-1 border-2 border-transparent border-t-white rounded-full animate-spin"
              style={{ borderTopColor: COLORS.cyan }}
            />
          )}
        </div>
      </button>
    );
  }

  // Expanded state - full chat card
  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-96 h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      style={{ backgroundColor: COLORS.white }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between flex-shrink-0 text-white"
        style={{ backgroundColor: COLORS.navy }}
      >
        <div className="flex items-center gap-3">
          <div className="text-2xl">🚀</div>
          <div>
            <h3 className="font-bold text-base">BevGenie AI</h3>
            <p className="text-xs opacity-80">Always here to help</p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          title="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Container */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        style={{ backgroundColor: COLORS.white }}
      >
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <div className="text-4xl mb-3">💬</div>
              <p className="text-sm font-medium" style={{ color: COLORS.darkGray }}>
                Start a conversation
              </p>
              <p className="text-xs mt-2" style={{ color: COLORS.textGray }}>
                Ask me anything about your beverage business
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className="animate-fade-in">
            {/* User Message */}
            {msg.role === 'user' && (
              <div className="flex justify-end">
                <div
                  className="max-w-xs px-4 py-2 rounded-lg rounded-tr-none shadow-sm text-white text-sm font-medium break-words"
                  style={{
                    backgroundColor: COLORS.navy,
                  }}
                >
                  {msg.content}
                </div>
              </div>
            )}

            {/* Assistant Message */}
            {msg.role === 'assistant' && (
              <div className="flex justify-start">
                <div
                  className="max-w-xs px-4 py-2 rounded-lg rounded-tl-none shadow-sm text-sm break-words"
                  style={{
                    backgroundColor: COLORS.lightGray,
                    color: COLORS.darkGray,
                  }}
                >
                  {msg.content}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div
              className="px-4 py-2 rounded-lg rounded-tl-none"
              style={{
                backgroundColor: COLORS.lightGray,
                color: COLORS.textGray,
              }}
            >
              <div className="flex gap-1 items-center">
                <div
                  className="w-2 h-2 bg-current rounded-full animate-bounce"
                  style={{ backgroundColor: COLORS.cyan }}
                />
                <div
                  className="w-2 h-2 bg-current rounded-full animate-bounce"
                  style={{ backgroundColor: COLORS.cyan, animationDelay: '0.1s' }}
                />
                <div
                  className="w-2 h-2 bg-current rounded-full animate-bounce"
                  style={{ backgroundColor: COLORS.cyan, animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className="border-t px-4 py-3 flex-shrink-0"
        style={{ borderColor: COLORS.mediumGray }}
      >
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask something..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all disabled:bg-gray-100"
              style={{
                borderColor: COLORS.mediumGray,
                focusRingColor: COLORS.cyan,
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-2 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{ backgroundColor: COLORS.cyan }}
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={onClearChat}
              disabled={isLoading}
              className="w-full px-3 py-2 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
              style={{
                backgroundColor: COLORS.lightGray,
                color: COLORS.textGray,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.mediumGray)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = COLORS.lightGray)
              }
            >
              <RotateCcw className="w-3 h-3 inline mr-1" />
              Clear
            </button>
          )}
        </form>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
