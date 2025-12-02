// فایل: app/page.tsx

'use client';

import { useChat } from 'ai/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react'; // Suspense اضافه شد

// 1. ایمپورت کردن اکشن‌های سرور
import { getOrCreateUser, getChats } from '@/app/actions';

// 2. ایمپورت کامپوننت‌ها
import Sidebar from "@/components/sidebar";
import { ChatScreen } from '@/components/chat-screen';
import ChatInput from '@/components/chat-input';

// 3. ساخت یک کامپوننت داخلی که منطق اصلی را نگه می‌دارد
function ChatAppContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeChatId = searchParams.get('chatId');

  const [user, setUser] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);

  const { messages, setMessages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { chatId: activeChatId },
    onFinish: async (message) => {
      if (!activeChatId && user) {
        const updatedChats = await getChats(user.id);
        setChats(updatedChats);
        const newChat = updatedChats.find(chat =>
          chat.messages.some((m: any) => m.id === message.id)
        );
        if (newChat) {
          router.push(`/?chatId=${newChat.id}`);
        }
      } else if (activeChatId && user) {
        const updatedChats = await getChats(user.id);
        setChats(updatedChats);
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const fetchedUser = await getOrCreateUser();
      setUser(fetchedUser);
      if (fetchedUser) {
        const fetchedChats = await getChats(fetchedUser.id);
        setChats(fetchedChats);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (activeChatId) {
      const chat = chats.find(c => c.id === activeChatId);
      if (chat && chat.messages) {
        setMessages(chat.messages);
      }
    } else {
      setMessages([]);
    }
  }, [activeChatId, chats, setMessages]);


  const handleNewChat = () => {
    router.push('/');
  };

  if (!user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <div className="hidden md:block md:w-64 border-r">
        <Sidebar
          user={user}
          chats={chats}
          activeChatId={activeChatId || undefined}
          onNewChat={handleNewChat}
        />
      </div>

      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto">
          <ChatScreen messages={messages} />
        </main>

        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

// 4. کامپوننت اصلی که فقط نقش Wrapper را بازی می‌کند
export default function Home() {
  return (
    // Suspense باعث می‌شود تا زمانی که پارامترهای URL لود نشده‌اند، fallback نمایش داده شود
    <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center">در حال راه‌اندازی...</div>}>
      <ChatAppContent />
    </Suspense>
  );
}
