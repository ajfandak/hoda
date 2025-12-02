"use client";

import { useState, useEffect } from "react";
import { getOrCreateUser } from "@/app/actions"; 
import Sidebar from "@/components/sidebar";
import ChatScreen from "@/components/chat-screen";
import { Menu } from "lucide-react";

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function initUser() {
      try {
        const user = await getOrCreateUser();
        if (user) {
          setUserId(user.id);
        }
      } catch (error) {
        console.error("Failed to init user:", error);
      }
    }
    initUser();
  }, []);

  return (
    <div className="flex h-screen bg-[#020817] text-white overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:block border-l border-gray-800 bg-[#0d1117]`}
      >
        {userId && (
          <Sidebar
            userId={userId}
            // تغییر مهم اینجاست: تبدیل null به undefined
            activeChatId={activeChatId || undefined}
            onSelectChat={(id) => {
              setActiveChatId(id);
              setIsSidebarOpen(false);
            }}
            onNewChat={() => {
              setActiveChatId(null);
              setIsSidebarOpen(false);
            }}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 border-b border-gray-800 bg-[#0d1117]">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-300">
            <Menu className="h-6 w-6" />
          </button>
          <span className="mr-4 font-bold text-gray-100">هدی</span>
        </div>

        {/* Chat Screen */}
        <div className="flex-1 overflow-hidden relative">
          <ChatScreen chatId={activeChatId || ""} />
        </div>
      </div>
    </div>
  );
}
