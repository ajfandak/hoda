"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Plus } from "lucide-react";
import { getChats } from "@/app/actions";

interface Chat {
  id: string;
  title: string;
  createdAt: Date;
}

interface SidebarProps {
  userId: string;
  activeChatId?: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

export default function Sidebar({ userId, activeChatId, onSelectChat, onNewChat }: SidebarProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    
    getChats(userId)
      .then((data) => setChats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-gray-300 p-4">
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg mb-6 transition-colors font-medium"
      >
        <Plus size={20} />
        <span>چت جدید</span>
      </button>

      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
        {loading && <div className="text-center text-sm text-gray-500 mt-4">در حال بارگذاری...</div>}
        
        {!loading && chats.length === 0 && (
          <div className="text-center text-sm text-gray-500 mt-4">هنوز گفتگویی ندارید</div>
        )}

        {!loading && chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-right transition-colors ${
              activeChatId === chat.id
                ? "bg-gray-800 text-white border border-gray-700"
                : "hover:bg-gray-800/50 hover:text-white"
            }`}
          >
            <MessageSquare size={18} className="shrink-0 text-gray-500" />
            <div className="truncate text-sm w-full font-iransans">
              {chat.title || "گفتگوی جدید"}
            </div>
          </button>
        ))}
      </div>

      <div className="pt-4 mt-4 border-t border-gray-800">
        <div className="text-xs text-center text-gray-600">هدی - دستیار هوشمند</div>
      </div>
    </div>
  );
}
// END OF FILE - مطمئن شوید این خط و پرانتز بسته بالای آن کپی شده باشد
