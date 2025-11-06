'use client';

import React, { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { DynamicPageRenderer } from './dynamic-page-renderer';
import { PageLoadingScreen } from './page-loading-screen';
import type { BevGeniePage } from '@/lib/ai/page-specs';
import type { DynamicPageData } from '@/hooks/useChat';

interface FullScreenPageViewProps {
  page: BevGeniePage;
  isLoading: boolean;
  onClose: () => void;
  onOpenChat: () => void;
  chatMessages: number;
}

/**
 * Full-Screen Page View Component
 *
 * Displays generated pages in full screen with:
 * - Full-screen page rendering
 * - Chat history toggle (sidebar)
 * - Loading animations while page generates
 * - Close button to return to landing page
 */
export function FullScreenPageView({
  page,
  isLoading,
  onClose,
  onOpenChat,
  chatMessages,
}: FullScreenPageViewProps) {
  const [showChatSidebar, setShowChatSidebar] = useState(false);

  return (
    <div className="fixed inset-0 bg-white">
      {/* Loading Screen */}
      <PageLoadingScreen isVisible={isLoading} style="neural-network" />

      {/* Header Bar */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-xl">🚀</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">BevGenie Solution</h1>
            <p className="text-xs text-blue-100">AI-Generated Page</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Chat History Button */}
          <button
            onClick={() => setShowChatSidebar(!showChatSidebar)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            title="View chat history"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {chatMessages > 0 && <span className="ml-1">({chatMessages})</span>}
              Chat
            </span>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Return to landing page"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content - Full Screen Page */}
      <div className="h-screen overflow-y-auto bg-white">
        <div className="max-w-7xl mx-auto p-8">
          <DynamicPageRenderer
            page={page}
            compact={false}
            onDownload={() => {
              // TODO: Implement PDF download
              alert('PDF download coming soon!');
            }}
            onShare={() => {
              // TODO: Implement sharing
              alert('Share functionality coming soon!');
            }}
          />
        </div>
      </div>

      {/* Chat Sidebar */}
      {showChatSidebar && (
        <div className="fixed right-0 top-16 bottom-0 w-96 bg-white border-l border-gray-200 shadow-lg z-30 flex flex-col">
          {/* Sidebar Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-4">
            <h2 className="font-bold text-gray-900">Chat History</h2>
            <p className="text-xs text-gray-600 mt-1">
              {chatMessages} messages in conversation
            </p>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-sm text-gray-600 text-center py-8">
              Chat history will appear here
            </p>
          </div>

          {/* Sidebar Footer - New Message */}
          <div className="border-t p-4 bg-gray-50">
            <button
              onClick={() => setShowChatSidebar(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Ask Another Question
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Button (when sidebar closed) */}
      {!showChatSidebar && (
        <button
          onClick={() => setShowChatSidebar(true)}
          className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
          title="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
          {chatMessages > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {Math.min(chatMessages, 9)}
            </div>
          )}
        </button>
      )}
    </div>
  );
}
