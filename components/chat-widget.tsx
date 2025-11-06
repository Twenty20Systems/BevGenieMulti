'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { SendIcon, Loader2, MessageCircle, X, RotateCcw } from 'lucide-react';
import { DynamicPageRenderer } from './dynamic-page-renderer';
import { PageLoadingScreen, type LoaderStyle } from './page-loading-screen';

interface ChatWidgetProps {
  onPageGenerated?: (page: any) => void;
}

/**
 * Chat Widget Component - Improved Design
 *
 * Floating chat widget for collecting customer personas
 * and providing AI-powered responses
 */
export function ChatWidget({ onPageGenerated }: ChatWidgetProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loaderStyle, setLoaderStyle] = useState<LoaderStyle>('neural-network');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isLoading,
    error,
    persona,
    sendMessage,
    clearMessages,
    getPersonaInfo,
    generationStatus,
  } = useChat();

  const personaInfo = getPersonaInfo();

  // Rotate loader style for variety
  useEffect(() => {
    const styles: LoaderStyle[] = ['neural-network', 'chemical-reaction', 'holographic'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    setLoaderStyle(randomStyle);
  }, [generationStatus.isGeneratingPage]);

  // Trigger callback when a page is generated
  useEffect(() => {
    if (messages.length > 0 && onPageGenerated) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && lastMessage.generatedPage) {
        onPageGenerated(lastMessage.generatedPage.page);
      }
    }
  }, [messages, onPageGenerated]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = inputRef.current?.value.trim();
    if (message && !isLoading) {
      sendMessage(message);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Real-Time Progress Widget with Actual Streaming Progress */}
      {generationStatus.isGeneratingPage && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-40 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-gray-900">Generating page...</h3>
            <span className="text-xs font-semibold text-blue-600">{generationStatus.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${generationStatus.progress}%` }}
            ></div>
          </div>
          {generationStatus.stageName && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-gray-600">{generationStatus.stageName}</p>
            </div>
          )}
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base">BevGenie AI</h3>
                <p className="text-xs text-blue-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 hover:bg-opacity-50 p-2 rounded-full transition-all duration-200"
              title="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-sm font-medium text-gray-700">Welcome to BevGenie!</p>
                <p className="text-xs text-gray-500 mt-2 px-2">
                  Tell me about your beverage business and I'll help identify your needs.
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div key={message.id} className="animate-fade-in">
                    <div
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
                    >
                      <div
                        className={`max-w-xs px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed transition-all ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-md hover:shadow-lg'
                            : 'bg-gray-100 text-gray-900 rounded-bl-none shadow-sm'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>

                    {/* Render dynamic page if generated */}
                    {message.generatedPage && message.role === 'assistant' && (
                      <div className="flex justify-start mb-4 animate-fade-in">
                        <div className="w-full max-w-md bg-white border border-blue-200 rounded-lg overflow-hidden shadow-lg">
                          <DynamicPageRenderer page={message.generatedPage.page} compact={true} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-3 text-gray-600 py-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    </div>
                    <span className="text-sm">BevGenie is thinking...</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Persona Detection */}
          {personaInfo && messages.length > 0 && (
            <div className="px-4 py-3 bg-blue-50 border-t border-blue-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-700">Detected:</span>
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full font-semibold">
                  {personaInfo.userType}
                </span>
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-semibold">
                  {personaInfo.confidence}% confident
                </span>
              </div>
              {personaInfo.topPainPoints.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-xs font-bold text-gray-700">Pain Points:</span>
                  {personaInfo.topPainPoints.map((point) => (
                    <span
                      key={point}
                      className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-lg font-medium"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 bg-red-50 border-t border-red-100">
              <p className="text-xs text-red-700 font-medium">⚠️ {error}</p>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex-shrink-0">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center hover:shadow-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
                title="Send message"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <SendIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>

          {/* Footer Actions */}
          {messages.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t flex justify-center flex-shrink-0">
              <button
                onClick={clearMessages}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                Clear Chat
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        } ${
          messages.length > 0
            ? 'bg-gradient-to-r from-green-500 to-green-600 animate-pulse'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
        }`}
        title="Open BevGenie chat"
      >
        <MessageCircle className="w-8 h-8 text-white" />
        {messages.length > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {messages.length}
          </div>
        )}
      </button>

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
