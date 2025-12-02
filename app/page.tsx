// فایل: app/page.tsx

'use client';

import { useChat } from 'ai/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';

// اطمینان حاصل کنید که getMessages را ایمپورت کرده‌اید
import { getOrCreateUser, getChats, getMessages } from '@/app/actions'; 
import Sidebar from "@/components/sidebar";
import { ChatScreen } from '@/components/chat-screen';
import ChatInput from '@/components/chat-input';

function ChatAppContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeChatId = searchParams.get('chatId');

  const [user, setUser] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  
  // جلوگیری از فچ کردن تکراری در بارگذاری اولیه
  const initialMessagesLoaded = useRef(false);
  
  // *** تغییر مهم: این پرچم به ما کمک می‌کند بفهمیم آیا باید از دیتابیس بخوانیم یا نه ***
  const shouldFetchMessages = useRef(true);

  const { messages, setMessages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { chatId: activeChatId, userId: user?.id },
    onFinish: async (message) => {
      if (user) {
        // آپدیت لیست چت‌ها در سایدبار
        const updatedChats = await getChats(user.id);
        setChats(updatedChats);

        // اگر در صفحه اصلی بودیم (چت جدید)
        if (!activeChatId) {
            const newChat = updatedChats.find(chat => chat.messages.some((m: any) => m.id === message.id));
            if (newChat) {
                // *** نکته کلیدی: قبل از تغییر URL می‌گوییم "از دیتابیس نخوان!" ***
                // چون ما الان آخرین پیام‌ها را در صفحه داریم و نمی‌خواهیم دیتابیس قدیمی آن‌ها را پاک کند
                shouldFetchMessages.current = false;
                
                router.replace(`/?chatId=${newChat.id}`, { scroll: false });
            }
        }
      }
    }
  });

  // 1. دریافت اطلاعات کاربر و چت‌ها (فقط یکبار)
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

  // 2. مدیریت بارگذاری پیام‌ها (اصلاح شده برای جلوگیری از حذف پیام)
  useEffect(() => {
    // اگر chatId نداریم (صفحه جدید)، پیام‌ها را پاک کن و ریست کن
    if (!activeChatId) {
      setMessages([]);
      initialMessagesLoaded.current = false;
      shouldFetchMessages.current = true; // برای چت‌های بعدی آماده باش
      return;
    }

    // *** چک کردن پرچم امنیتی ***
    // اگر این پرچم false باشد، یعنی ما از پروسه "چت جدید" آمدیم و پیام‌ها در حافظه هستند
    // پس نباید چیزی را فچ کنیم تا پیام‌ها نپرد.
    if (shouldFetchMessages.current === false) {
        // پرچم را به حالت عادی برمی‌گردانیم تا اگر کاربر روی چت دیگری کلیک کرد، کار کند
        shouldFetchMessages.current = true;
        initialMessagesLoaded.current = true; // فرض می‌کنیم لود شده است
        return; 
    }

    // اگر قبلاً برای این چت لود کردیم، دوباره لود نکن
    if (initialMessagesLoaded.current) {
        return;
    }

    // بارگذاری از دیتابیس (فقط وقتی کاربر روی چت‌های قدیمی کلیک می‌کند)
    const fetchInitialMessages = async () => {
      try {
        const initialMessages = await getMessages(activeChatId);
        if (initialMessages && initialMessages.length > 0) {
          setMessages(initialMessages);
        }
        initialMessagesLoaded.current = true;
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };
    
    fetchInitialMessages();

    // Cleanup: وقتی activeChatId عوض میشه، پرچم لود شدن رو ریست میکنیم
    // اما فقط اگر واقعا چت عوض شده باشه (که توسط Dependency Array کنترل میشه)
    return () => {
        initialMessagesLoaded.current = false;
    };

  }, [activeChatId, setMessages]); 


  const handleNewChat = () => {
    shouldFetchMessages.current = true; // اجازه فچ کردن بده
    initialMessagesLoaded.current = false;
    router.push('/');
  };

  if (!user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        Loading...
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
    <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center">Loading...</div>}>
      <ChatAppContent />
    </Suspense>
  );
}
