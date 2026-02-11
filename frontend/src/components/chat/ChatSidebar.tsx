import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, Trash2, Settings, Github, Menu, X, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: number;
  preview?: string;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isOpen,
  onClose
}: ChatSidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        className={cn(
          "fixed top-16 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-black/80 backdrop-blur-xl transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/5">
          <div className="flex items-center gap-2 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Cpu size={18} className="text-white" />
            </div>
            <span className="font-bold tracking-wide">AI Chat</span>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className="group flex w-full items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 hover:shadow-lg hover:shadow-cyan-500/20 border border-white/10 hover:border-transparent"
          >
            <Plus size={18} className="text-cyan-400 group-hover:text-white transition-colors" />
            <span>新对话</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-none">
          <div className="mb-2 px-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            History
          </div>
          <div className="space-y-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  onSelectSession(session.id);
                  if (window.innerWidth < 768) onClose();
                }}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-all",
                  currentSessionId === session.id
                    ? "bg-white/10 text-white shadow-md"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                )}
              >
                <MessageSquare size={16} className={cn(
                  "shrink-0 transition-colors",
                  currentSessionId === session.id ? "text-cyan-400" : "text-zinc-600 group-hover:text-zinc-400"
                )} />
                <div className="flex-1 truncate">
                  <div className="truncate font-medium">{session.title}</div>
                  {session.preview && (
                    <div className="truncate text-xs text-zinc-500 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {session.preview}
                    </div>
                  )}
                </div>
                
                {/* Delete Button (Visible on Hover/Active) */}
                <div 
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity",
                    "group-hover:opacity-100"
                  )}
                >
                  <div
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id, e);
                    }}
                    className="rounded p-1.5 hover:bg-red-500/20 hover:text-red-400 text-zinc-500"
                  >
                    <Trash2 size={14} />
                  </div>
                </div>
              </button>
            ))}
            
            {sessions.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-zinc-600">
                暂无历史记录
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 p-4">
          <div className="flex items-center gap-2 rounded-xl bg-white/5 p-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500" />
            <div className="flex-1 overflow-hidden">
              <div className="truncate text-sm font-medium text-white">Guest User</div>
              <div className="truncate text-xs text-zinc-500">Pro Plan</div>
            </div>
            <button className="rounded p-1.5 text-zinc-400 hover:text-white transition-colors">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
