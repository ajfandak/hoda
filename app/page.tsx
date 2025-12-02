"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import ChatScreen from "@/components/chat-screen";
import { getOrCreateUser } from "./actions";

// تعریف اینترفیس برای پیام‌ها
interface Message {
  id: string;
  role: string;
  content: string;
}

export default function Home() {
  const [activeChatId, setActiveChatId] = useState<string | undefined>(undefined);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const user = await getOrCreateUser();
        if (user) {
            setUserId(user.id);
        }
      } catch (error) {
        console.error("Failed to init user:", error);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const handleSelectChat = (chatId: string, messages: any[]) => {
    setActiveChatId(chatId);
    setInitialMessages(messages);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#020817] text-white">
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#020817]">
      {/* سایدبار */}
      {userId && (
        <Sidebar 
            userId={userId} 
            onSelectChat={handleSelectChat} 
            activeChatId={activeChatId}
        />
      )}

      {/* صفحه چت */}
      <main className="flex-1 flex flex-col relative h-full">
        {/* شرط: چت اسکرین فقط وقتی نشان داده شود که activeChatId وجود داشته باشد */}
        {activeChatId ? (
            <ChatScreen 
                key={activeChatId}
                chatId={activeChatId}
                initialMessages={initialMessages}
            />
        ) : (
            // صفحه خالی وقتی هنوز چتی انتخاب نشده
            <div className="flex h-full flex-col items-center justify-center text-gray-500 space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <p className="text-lg font-medium text-gray-400">برای شروع یک چت جدید ایجاد کنید یا یکی را انتخاب کنید</p>
            </div>
        )}
      </main>
    </div>
  );
}
