// فایل: components/sidebar.tsx

'use client';

import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils'; // برای ترکیب کلاس‌های Tailwind

// 1. تعریف پراپ‌هایی که کامپوننت دریافت می‌کند
interface SidebarProps {
  user: any; // می‌توانید نوع دقیق‌تری تعریف کنید
  chats: any[]; // آرایه‌ای از چت‌ها
  activeChatId?: string; // آیدی چت فعال (اختیاری)
  onNewChat: () => void; // تابعی که هنگام کلیک روی "چت جدید" اجرا می‌شود
}

// 2. استفاده از پراپ‌ها در کامپوننت
export default function Sidebar({ user, chats, activeChatId, onNewChat }: SidebarProps) {
  return (
    <div className="flex flex-col h-full p-4 bg-background text-foreground border-r">
      {/* دکمه چت جدید */}
      <div className="mb-4">
        <button
          onClick={onNewChat}
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium border rounded-md hover:bg-accent hover:text-accent-foreground"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          چت جدید
        </button>
      </div>

      {/* لیست چت‌های قبلی */}
      <nav className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/?chatId=${chat.id}`}
              className={cn(
                'block px-3 py-2 text-sm rounded-md transition-colors',
                chat.id === activeChatId
                  ? 'bg-primary text-primary-foreground' // استایل چت فعال
                  : 'hover:bg-accent hover:text-accent-foreground' // استایل هاور
              )}
            >
              {/* عنوان چت (اولین پیام کاربر) */}
              <p className="truncate">
                {chat.messages?.[0]?.content || 'چت بدون عنوان'}
              </p>
            </Link>
          ))}
        </div>
      </nav>

      {/* بخش اطلاعات کاربر در پایین */}
      <div className="pt-4 mt-auto border-t">
        <div className="flex items-center">
          {/* <Avatar className="w-8 h-8 mr-2">
            <AvatarImage src={user?.image || ''} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar> */}
          <p className="text-sm font-medium truncate">{user?.email || 'کاربر مهمان'}</p>
        </div>
      </div>
    </div>
  );
}
