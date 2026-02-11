'use client';

import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import type { ConversationMessage } from '@/types';

interface MessageBubbleProps {
  message: ConversationMessage;
  isStreaming?: boolean;
}

export default function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-tech-cyan' : 'bg-tech-lightcyan'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-tech-darkblue" />
        )}
      </div>
      <div
        className={`flex-1 max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-tech-cyan text-white rounded-br-none'
            : 'bg-glass/30 backdrop-blur-xl border border-glass-border text-white rounded-bl-none'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium ${isUser ? 'text-white/80' : 'text-tech-cyan'}`}>
            {isUser ? '你' : 'AI 助手'}
          </span>
          {message.tokens && (
            <span className="text-xs text-white/50">{message.tokens} tokens</span>
          )}
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
          {isStreaming && (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="inline-block w-2 h-4 bg-current ml-1 align-middle"
            />
          )}
        </p>
      </div>
    </motion.div>
  );
}
