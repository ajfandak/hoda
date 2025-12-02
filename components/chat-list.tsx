// components/chat-list.tsx
"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Bot } from "lucide-react";
import { sendMessageWithId } from "@/app/actions"; // نام تابع عوض شد
import { useSearchParams } from "next/navigation"; // اضافه شد


interface Message {
  id: string;
  role: string;
  content: string;
}

interface ChatListProps {
  messages: Message[];
}

export default function ChatList({ messages }: ChatListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // هر بار که پیام‌ها تغییر کرد، به پایین اسکرول کن
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 opacity-50">
        <Bot className="w-20 h-20 mb-4" />
        <p className="text-lg">شروع یک گفتگوی جدید...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-4 ${
            msg.role === "user" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {/* آیکون */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === "user" ? "bg-blue-600" : "bg-emerald-600"
            }`}
          >
            {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </div>

          {/* حباب پیام */}
          <div
            className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed overflow-hidden ${
              msg.role === "user"
                ? "bg-blue-600/10 text-blue-100 rounded-tr-none border border-blue-600/20"
                : "bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700"
            }`}
          >
            {/* نمایش مارک‌داون */}
            <div className="markdown-body dir-auto" dir="auto">
              {msg.role === "user" ? (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // استایل‌دهی به کدها
                    code({node, className, children, ...props}) {
  const match = /language-(\w+)/.exec(className || '')
  return match ? (
    // تغییر: اضافه کردن dir="ltr" و text-left برای چپ‌چین شدن کدها
    <div dir="ltr" className="bg-gray-950 text-left rounded-md p-3 my-2 overflow-x-auto border border-gray-700 font-mono text-sm">
      <code className={className} {...props}>
        {children}
      </code>
    </div>
  ) : (
    <code className="bg-gray-700/50 px-1.5 py-0.5 rounded text-orange-300 font-mono dir-ltr" {...props}>
      {children}
    </code>
  )
},
                    // استایل‌دهی به لیست‌ها
                    ul: ({children}) => <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>,
                    // استایل‌دهی به تیترها
                    h1: ({children}) => <h1 className="text-xl font-bold my-3 pb-2 border-b border-gray-700">{children}</h1>,
                    h2: ({children}) => <h2 className="text-lg font-bold my-3">{children}</h2>,
                    h3: ({children}) => <h3 className="text-base font-bold my-2">{children}</h3>,
                    p: ({children}) => <p className="my-1">{children}</p>,
                    a: ({children, href}) => <a href={href} target="_blank" className="text-blue-400 hover:underline">{children}</a>,
                    strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        </div>
      ))}
      {/* المان نامرئی برای اسکرول */}
      <div ref={scrollRef} />
    </div>
  );
}
