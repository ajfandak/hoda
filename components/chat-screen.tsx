"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2, StopCircle, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatScreenProps {
  chatId: string;
  initialMessages?: any[];
}

export default function ChatScreen({ chatId, initialMessages = [] }: ChatScreenProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    api: "/api/chat",
    body: { chatId },
    initialMessages: initialMessages.map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    })),
  });

  // اسکرول خودکار
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    // پس‌زمینه اصلی: تیره (Slate-950)
    <div className="flex flex-col h-[100dvh] w-full bg-[#020817] text-white relative">
      
      {/* لیست پیام‌ها */}
      <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-5 pb-24 scrollbar-hide">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-60">
             <Bot className="w-16 h-16 mb-4 text-blue-500" />
             <p className="text-sm font-medium">چطور می‌تونم کمکت کنم؟</p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 md:gap-3 ${
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* آیکون‌ها */}
            <div
              className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center shrink-0 mt-1 border border-white/10 ${
                m.role === "user" ? "bg-blue-600" : "bg-[#1e293b]"
              }`}
            >
              {m.role === "user" ? (
                <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
              ) : (
                <Bot className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              )}
            </div>

            {/* حباب پیام */}
            <div
              className={`rounded-2xl px-3 py-2.5 md:px-5 md:py-3 max-w-[85%] md:max-w-[75%] text-sm leading-relaxed overflow-hidden shadow-lg ${
                m.role === "user"
                  ? "bg-blue-600 text-white" // پیام کاربر: آبی
                  : "bg-[#1e293b] border border-white/5 text-gray-100" // پیام ربات: خاکستری تیره
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // استایل کدهای برنامه‌نویسی (مثل پایتون)
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return match ? (
                      <div className="my-3 rounded-lg overflow-hidden bg-[#0f172a] border border-white/10 dir-ltr text-left">
                        <div className="bg-[#1e293b] px-3 py-1.5 text-[10px] md:text-xs text-gray-400 flex justify-between items-center border-b border-white/5">
                          <span className="font-mono uppercase">{match[1]}</span>
                        </div>
                        <pre className="p-3 overflow-x-auto text-[11px] md:text-sm font-mono text-blue-100">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    ) : (
                      <code
                        className={`px-1.5 py-0.5 rounded font-mono text-xs ${
                           m.role === "user" 
                           ? "bg-white/20 text-white" 
                           : "bg-[#0f172a] text-pink-400 border border-white/10"
                        }`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  a: ({ node, ...props }) => (
                    <a {...props} className="text-blue-400 underline hover:text-blue-300" target="_blank" />
                  ),
                  p: ({ node, children, ...props }) => (
                    <p className="mb-1.5 last:mb-0" dir="auto">{children}</p>
                  ),
                  ul: ({ node, children, ...props }) => (
                    <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>
                  ),
                  ol: ({ node, children, ...props }) => (
                    <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>
                  )
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400 text-xs md:text-sm animate-pulse mr-12">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>در حال فکر کردن...</span>
          </div>
        )}
        <div ref={scrollRef} className="h-1" />
      </div>

      {/* بخش ورودی */}
      <div className="shrink-0 p-2 md:p-4 bg-[#020817]/80 backdrop-blur-md border-t border-white/5 absolute bottom-0 w-full z-10">
        <div className="max-w-3xl mx-auto relative">
          <form
            onSubmit={handleSubmit}
            className="w-full relative flex items-center bg-[#1e293b] rounded-full border border-white/10 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all shadow-2xl"
          >
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="پیام خود را بنویسید..."
              // استایل اینپوت: رنگ زمینه تیره، متن سفید
              className="w-full py-3 md:py-4 pl-12 pr-5 bg-transparent border-none focus:ring-0 focus:outline-none text-sm md:text-base text-white placeholder:text-gray-500"
              disabled={isLoading}
              autoComplete="off"
            />
            
            <div className="absolute left-1.5 flex items-center">
              {isLoading ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => stop()}
                  className="h-8 w-8 md:h-10 md:w-10 rounded-full text-red-400 hover:bg-red-500/10"
                >
                  <StopCircle className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim()}
                  className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-50 disabled:bg-gray-700"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
