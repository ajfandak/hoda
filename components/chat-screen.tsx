"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import ChatInput from "./chat-input";
import ChatList from "./chat-list"; // فرض بر این است که این فایل وجود دارد و سالم است

interface ChatScreenProps {
  chatId: string;
  initialMessages?: any[];
}

export default function ChatScreen({ chatId, initialMessages = [] }: ChatScreenProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
    body: { chatId },
    initialMessages: initialMessages,
  });

  // اگر چت تغییر کرد، پیام‌های اولیه جدید را ست کن
  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [chatId, initialMessages, setMessages]);

  return (
    <div className="flex flex-col h-full w-full bg-[#020817]">
      {/* لیست پیام‌ها */}
      <div className="flex-1 overflow-hidden relative">
        <ChatList messages={messages} isLoading={isLoading} />
      </div>

      {/* ورودی پیام */}
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
