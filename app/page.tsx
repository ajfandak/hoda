// فایل: app/page.tsx

'use client';

import { useChat } from 'ai/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react'; // useRef اضافه شد

import { getOrCreateUser, getChats } from '@/app/actions';
import Sidebar from "@/components/sidebar";
import { ChatScreen } from '@/components/chat-screen';
import ChatInput from '@/components/chat-input';

function ChatAppContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeChatId = searchParams.get('chatId');

  const [user, setUser] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  
  // 1. یک پرچم برای جلوگیری از اجرای اولیه useEffect
  const isInitialLoad = useRef(true);

  const { messages, setMessages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { chatId: activeChatId },
    // 2. در onFinish فقط لیست چت‌ها را آپدیت می‌کنیم
    onFinish: async () => {
      if (user) {
        const updatedChats = await getChats(user.id);
        setChats(updatedChats);

        // اگر چت جدیدی بود، به URL جدید ریدایرکت می‌کنیم
        if (!activeChatId && updatedChats.length > chats.length) {
            // پیدا کردن جدیدترین چت (معمولاً آخرین چت در آرایه مرتب شده بر اساس تاریخ)
            const newChat = updatedChats.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
            if (newChat) {
                // با replace به جای push تا در تاریخچه مرورگر برنگردد
                router.replace(`/?chatId=${newChat.id}`);
            }
        }
      }
    }
  });

  // افکت برای گرفتن اطلاعات اولیه کاربر و چت‌ها
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

  // 3. افکت اصلاح شده برای بارگذاری پیام‌های یک چت
  useEffect(() => {
    // در بارگذاری اولیه کامپوننت، این افکت را اجرا نکن
    if (isInitialLoad.current) {
        isInitialLoad.current = false;
        // اگر chatId وجود داشت، پیام‌ها را برای اولین بار لود کن
        if (activeChatId) {
            const chat = chats.find(c => c.id === activeChatId);
            if (chat && chat.messages.length > 0) {
                setMessages(chat.messages);
            }
        }
        return;
    }

    // این افکت فقط زمانی اجرا شود که کاربر بین چت‌ها جابجا می‌شود (activeChatId تغییر می‌کند)
    if (activeChatId) {
      const chat = chats.find(c => c.id === activeChatId);
      // فقط در صورتی پیام‌ها را ست کن که از `useChat` خالی نباشند (یعنی کاربر در حال چت نباشد)
      if (chat && !isLoading) {
        setMessages(chat.messages);
      }
    } else {
      // اگر به صفحه اصلی برگشتیم (چت جدید) پیام‌ها را خالی کن
      setMessages([]);
    }
  }, [activeChatId, chats]); // setMessages و isLoading حذف شد تا تریگرهای ناخواسته کم شوند


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

export default function Home() {
  return (
    <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center">در حال راه‌اندازی...</div>}>
      <ChatAppContent />
    </Suspense>
  );
}
