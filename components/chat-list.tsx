"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Bot } from "lucide-react";

interface Message {
  id: string;
  role: string;
  content: string;
}

interface ChatListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatList({ messages, isLoading }: ChatListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // اسکرول خودکار به پایین وقتی پیام جدید می‌آید
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 opacity-50">
          <Bot size={48} />
          <p>برای شروع گفتگو پیامی بنویسید...</p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex w-full ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex gap-3 max-w-[85%] ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* آیکون */}
              <div
                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* حباب پیام */}
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-[#1e293b] text-gray-100 rounded-tl-none border border-gray-700"
                }`}
              >
                {/* رندر کردن مارک‌داون برای پاسخ‌های هوش مصنوعی */}
                {message.role === "assistant" ? (
                  // تغییر: کلاس‌ها به یک دایو دور کامپوننت داده شد تا خطای تایپ رفع شود
                  <div className="prose prose-invert prose-sm max-w-none break-words">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // استایل‌دهی سفارشی برای لینک‌ها و کدها
                        a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline" {...props} />,
                        code: ({node, ...props}) => <code className="bg-gray-800 px-1 py-0.5 rounded text-xs font-mono" {...props} />
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {/* نمایش لودینگ در حین تایپ هوش مصنوعی */}
      {isLoading && (
        <div className="flex justify-start w-full">
          <div className="flex gap-3 max-w-[85%]">
            <div className="shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
              <Bot size={16} />
            </div>
            <div className="bg-[#1e293b] border border-gray-700 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
