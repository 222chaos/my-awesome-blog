import { useRef, useState, useEffect } from 'react';
import { Send, StopCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, onStop, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading || disabled) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-3xl p-4">
      <div className="relative flex items-end gap-2 rounded-3xl bg-white/5 p-2 shadow-2xl backdrop-blur-xl border border-white/10 ring-1 ring-white/5 transition-all focus-within:ring-cyan-500/50 focus-within:bg-white/10">
        
        {/* Magic Icon (Optional) */}
        <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-400">
          <Sparkles size={18} />
        </div>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息与 AI 对话..."
          disabled={disabled}
          rows={1}
          className="max-h-[200px] min-h-[44px] w-full resize-none bg-transparent py-3 px-2 text-base text-white placeholder-zinc-500 focus:outline-none scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent"
          style={{ height: '44px' }}
        />

        <div className="flex shrink-0 pb-1 pr-1">
          {isLoading ? (
            <button
              onClick={onStop}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
              title="停止生成"
            >
              <StopCircle size={20} />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim() || disabled}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
                input.trim() && !disabled
                  ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95"
                  : "bg-zinc-700/50 text-zinc-500 cursor-not-allowed"
              )}
            >
              <Send size={18} className={cn(input.trim() && "ml-0.5")} />
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-2 text-center text-xs text-zinc-500">
        AI 内容可能包含错误，请核对重要信息。
      </div>
    </div>
  );
}
