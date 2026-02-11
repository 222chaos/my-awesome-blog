'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import AILayout from '@/components/ai/AILayout';
import ChatSidebar from '@/components/ai/chat/ChatSidebar';
import ChatInput from '@/components/ai/chat/ChatInput';
import MessageBubble from '@/components/ai/chat/MessageBubble';
import type { Conversation, ConversationMessage, LLMStreamChunk } from '@/types';
import { conversationService } from '@/services/conversationService';
import { llmService } from '@/services/llmService';

export default function ChatPage() {
  const pathname = usePathname();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const result = await conversationService.getConversations({ limit: 50, status: 'active' });
      setConversations(result.items);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const handleCreateConversation = async () => {
    try {
      const newConv = await conversationService.createConversation({
        title: '新对话',
        model: 'deepseek-chat',
      });
      setConversations([newConv, ...conversations]);
      await selectConversation(newConv.id);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const selectConversation = async (id: string) => {
    try {
      const conv = await conversationService.getConversation(id);
      setCurrentConversation(conv);
      setMessages(conv.messages);
      setCurrentResponse('');
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await conversationService.deleteConversation(id);
      setConversations(conversations.filter((c) => c.id !== id));
      if (currentConversation?.id === id) {
        setCurrentConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const handleArchiveConversation = async (id: string) => {
    try {
      await conversationService.archiveConversation(id);
      setConversations(
        conversations.map((c) => (c.id === id ? { ...c, status: 'archived' } : c))
      );
    } catch (error) {
      console.error('Failed to archive conversation:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentConversation) {
      await handleCreateConversation();
      return;
    }

    const userMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      conversation_id: currentConversation.id,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    setIsLoading(true);
    setIsStreaming(true);
    setCurrentResponse('');

    try {
      await llmService.chatStream(
        {
          message: content,
          conversation_id: currentConversation.id,
          provider: 'deepseek' as const,
          model: currentConversation.model,
          stream: true,
        },
        (chunk: LLMStreamChunk) => {
          if (chunk.delta) {
            setCurrentResponse((prev) => prev + chunk.delta);
          }
          if (chunk.done) {
            setIsStreaming(false);
            setIsLoading(false);
          }
        },
        () => {
          const assistantMessage: ConversationMessage = {
            id: crypto.randomUUID(),
            conversation_id: currentConversation.id,
            role: 'assistant',
            content: currentResponse,
            created_at: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setCurrentResponse('');
          setIsStreaming(false);
          setIsLoading(false);
        },
        (error) => {
          console.error('Chat error:', error);
          setIsStreaming(false);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <AILayout title="对话" currentPath={pathname}>
      <div className="flex gap-4 h-[calc(100vh-120px)]">
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversation?.id || null}
          onSelectConversation={selectConversation}
          onCreateConversation={handleCreateConversation}
          onDeleteConversation={handleDeleteConversation}
          onArchiveConversation={handleArchiveConversation}
        />

        <div className="flex-1 flex flex-col bg-glass/20 backdrop-blur-xl rounded-xl border border-glass-border">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!currentConversation ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 8-3.582 8-8 8-8zM12 14a2 2 0 100-4 2 2 0 114-4 2 0 014z" />
                  </svg>
                  <h3 className="text-lg font-medium text-white mb-2">开始一个新对话</h3>
                  <p className="text-sm text-white/50">选择左侧的对话或创建新对话</p>
                </div>
              </div>
            ) : (
              <>
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MessageBubble
                        message={message}
                        isStreaming={isStreaming && index === messages.length - 1 && message.role === 'assistant'}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isStreaming && currentResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-tech-lightcyan">
                      <svg className="w-5 h-5 text-tech-darkblue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a2 2 0 100 4 2 2 0 114-4 2 0 014z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4l4 4m-4-4v8" />
                      </svg>
                    </div>
                    <div className="flex-1 max-w-[70%] rounded-2xl px-4 py-3 bg-glass/30 backdrop-blur-xl border border-glass-border text-white rounded-bl-none">
                      <div className="flex items-center mb-2">
                        <span className="text-xs font-medium text-tech-cyan">AI 助手</span>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {currentResponse}
                        <motion.span
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="inline-block w-2 h-4 bg-current ml-1 align-middle"
                        />
                      </p>
                    </div>
                  </motion.div>
                )}
              </>
            )}
            
            {messages.length === 0 && !isStreaming && currentConversation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-full items-center justify-center"
              >
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 8-3.582 8-8 8-8zM12 14a2 2 0 100-4 2 2 0 114-4 2 0 014z" />
                  </svg>
                  <h3 className="text-lg font-medium text-white mb-2">开始对话</h3>
                  <p className="text-sm text-white/50">输入下方消息开始与 AI 助手对话</p>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/10">
            <ChatInput
              onSend={handleSendMessage}
              disabled={isLoading || !currentConversation}
              placeholder={currentConversation ? '输入消息...' : '请先创建或选择一个对话'}
            />
          </div>
        </div>

        <div className="w-72 bg-glass/30 backdrop-blur-xl border-l border-glass-border rounded-xl p-4">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1 .75-3L9 20l1 1h8l1-1-.75 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-18m0 0l-6 18" />
            </svg>
            上下文信息
          </h3>
          
          {currentConversation && (
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-white/70 mb-1">当前对话</p>
                <p className="text-sm text-white font-medium">{currentConversation.title}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
                  <span>{currentConversation.total_messages} 条消息</span>
                  <span>•</span>
                  <span>{currentConversation.total_tokens} tokens</span>
                  <span>•</span>
                  <span>{currentConversation.model}</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-white/70 mb-1">对话状态</p>
                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs ${
                  currentConversation.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    currentConversation.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                  }`} />
                  <span>{currentConversation.status === 'active' ? '进行中' : '已归档'}</span>
                </div>
              </div>

              {messages.length > 0 && (
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-white/70 mb-2">最近消息</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {messages.slice(-3).map((msg) => (
                      <div key={msg.id} className="text-xs text-white/80">
                        <span className={`inline-block px-1.5 py-0.5 rounded mr-1 ${
                          msg.role === 'user' ? 'bg-tech-cyan/30 text-tech-cyan' : 'bg-tech-lightcyan/30 text-tech-lightcyan'
                        }`}>
                          {msg.role === 'user' ? '你' : 'AI'}
                        </span>
                        <span className="line-clamp-1">{msg.content}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AILayout>
  );
}
