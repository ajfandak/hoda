'use client';

import { UseChatHelpers } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';
import { CodeBlock } from '@/components/code-block'; // ایمپورت کامپوننت جدید

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
          
          <div className={cn(
            'flex-1 space-y-2 overflow-hidden px-1',
            // کلاس prose تمام استایل‌دهی متن‌ها (لیست، بولد، تیتر) را اتوماتیک انجام می‌دهد
            'prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0'
          )}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // فقط کد بلاک را دستی هندل می‌کنیم تا از کامپوننت رنگی ما استفاده کند
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
                      className="bg-muted px-1.5 py-0.5 rounded-md font-mono text-sm before:content-none after:content-none"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
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
