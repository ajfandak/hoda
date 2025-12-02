// components/sidebar.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

interface Chat {
  id: string;
  title: string | null;
}

export default function Sidebar({ chats }: { chats: Chat[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const activeChatId = searchParams.get("id");

  return (
    <>
      {/* دکمه منو برای موبایل - شناور بالا سمت راست */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-800 text-white border border-gray-700 shadow-lg"
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* لایه تاریک پس‌زمینه در موبایل */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* خود سایدبار */}
      <aside 
        className={`
          fixed md:static inset-y-0 right-0 z-50 w-80 bg-gray-950 border-l border-gray-800 flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h1 className="font-bold text-xl text-white">هُدا پلتفرم</h1>
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
              <Plus className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {chats.map((chat) => (
            <Link 
              key={chat.id} 
              href={`/?id=${chat.id}`} 
              className="block"
              onClick={() => setIsOpen(false)}
            >
              <div
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeChatId === chat.id 
                    ? "bg-blue-600/20 text-blue-100 border border-blue-600/30" 
                    : "hover:bg-gray-900 text-gray-400 border border-transparent"
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="truncate text-sm dir-auto text-right w-full">
                  {chat.title || "گفتگوی جدید"}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-950/50">
            <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm">
                <p className="text-white font-medium">کاربر مهمان</p>
            </div>
            </div>
        </div>
      </aside>
    </>
  );
}
