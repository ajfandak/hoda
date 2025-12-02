// فایل: app/page.tsx
'use client'

import { useChat, type Message } from 'ai/react'
import { cn } from '@/lib/utils'
import { ChatInput } from '@/components/chat-input'
import { useEffect, useRef, useState } from 'react'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { CodeBlock } from '@/components/code-block'
import { getMessages } from '@/app/actions'

export default function Chat() {
  const { messages, append, reload, stop, isLoading, input, setInput } = useChat()
  const [initialMessages, setInitialMessages] = useState<Message[]>([])
  const [isFetching, setIsFetching] = useState(true)

  // این Ref ها از اجرای مجدد و ناخواسته useEffect جلوگیری می‌کنند
  const shouldFetchMessages = useRef(true)
  const initialMessagesLoaded = useRef(false)

  useEffect(() => {
    const loadInitialMessages = async () => {
      // فقط یک بار در اولین رندر اجرا شود
      if (shouldFetchMessages.current && !initialMessagesLoaded.current) {
        shouldFetchMessages.current = false // جلوگیری از اجرای مجدد
        setIsFetching(true)
        const fetchedMessages = await getMessages()
        setInitialMessages(fetchedMessages)
        initialMessagesLoaded.current = true // علامت‌گذاری به عنوان بارگذاری شده
        setIsFetching(false)
      }
    }

    loadInitialMessages()
  }, [])

  // ادغام پیام‌های اولیه با پیام‌های در حال استریم
  const displayMessages = [...initialMessages, ...messages]

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto py-24 stretch">
      <div className="flex-1 overflow-y-auto">
        {displayMessages.length > 0 ? (
          <div className="relative px-4">
            {displayMessages.map((m: Message, index: number) => (
              <div key={index} className="mb-4">
                <div
                  className={cn(
                    'flex items-start',
                    m.role === 'user' ? 'justify-end' : ''
                  )}
                >
                  <div
                    className={cn(
                      'rounded-lg px-4 py-2',
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <MemoizedReactMarkdown
                      className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 text-foreground"
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '')
                          if (inline) {
                            return (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            )
                          }
                          return (
                            <CodeBlock
                              key={Math.random()}
                              language={(match && match[1]) || ''}
                              value={String(children).replace(/\n$/, '')}
                              {...props}
                            />
                          )
                        }
                      }}
                    >
                      {m.content}
                    </MemoizedReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            {isFetching ? 'در حال بارگذاری تاریخچه چت...' : 'هنوز پیامی وجود ندارد. گفت‌و‌گو را شروع کنید.'}
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
        <div className="mx-auto sm:max-w-2xl sm:px-4">
          <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
            <ChatInput
              input={input}
              setInput={setInput}
              onSubmit={async value => {
                await append({
                  content: value,
                  role: 'user'
                })
              }}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
