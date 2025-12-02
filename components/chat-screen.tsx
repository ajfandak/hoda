'use client';

import { UseChatHelpers } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';

// --- کامپوننت کمکی برای نمایش بلوک کد ---
function CodeBlock({ language, value }: { language: string; value: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative my-4 overflow-hidden rounded-lg border bg-zinc-950 dark:bg-zinc-900 text-slate-50">
      <div className="flex items-center justify-between bg-zinc-800 px-4 py-2 text-xs text-zinc-400">
        <span className="font-mono lowercase">{language || 'code'}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 hover:text-white"
        >
          {isCopied ? (
            <>
              <Check className="h-3 w-3" /> کپی شد
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> کپی
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <code className="font-mono text-sm">{value}</code>
      </div>
    </div>
  );
}

// --- کامپوننت اصلی چت اسکرین ---
export interface ChatScreenProps extends Pick<UseChatHelpers, 'messages'> {}

export function ChatScreen({ messages }: ChatScreenProps) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="flex-1 space-y-4 p-4 pb-36 sm:p-8">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex w-full items-start gap-4 p-4 rounded-lg',
            message.role === 'user' 
              ? 'flex-row-reverse bg-primary/10' 
              : 'bg-muted/50'
          )}
        >
          <div
            className={cn(
              'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border shadow',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background'
            )}
          >
            {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </div>
          
          <div className="flex-1 space-y-2 overflow-hidden px-1">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // سفارشی‌سازی نمایش کد
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isBlock = !inline && match;

                  if (isBlock) {
                    return (
                      <CodeBlock
                        language={match[1]}
                        value={String(children).replace(/\n$/, '')}
                      />
                    );
                  }

                  return (
                    <code
                      className={cn(
                        'bg-muted px-1.5 py-0.5 rounded-md font-mono text-sm',
                        className
                      )}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                // استایل‌دهی به لیست‌ها و پاراگراف‌ها برای خوانایی بهتر
                ul: ({ children }) => <ul className="list-disc pr-6 mb-4">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pr-6 mb-4">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                p: ({ children }) => <p className="mb-4 last:mb-0 leading-7">{children}</p>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}
