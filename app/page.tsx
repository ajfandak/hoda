// app/page.tsx
import { db } from "@/lib/db";
import Sidebar from "@/components/sidebar";
import ChatScreen from "@/components/chat-screen"; // کامپوننت جدید

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home(props: Props) {
  const searchParams = await props.searchParams;
  
  const user = await db.user.findUnique({
    where: { email: "user@example.com" }
  });

  if (!user) {
     // هندل کردن نبود کاربر (فقط برای اطمینان)
     await db.user.create({ data: { email: "user@example.com", name: "Guest" }});
  }

  const chats = user ? await db.chat.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  }) : [];

  const activeChatId = typeof searchParams.id === 'string' ? searchParams.id : undefined;

  // اگر چتی انتخاب شده، پیام‌هایش را بگیر
  const initialMessages = activeChatId 
    ? await db.message.findMany({
        where: { chatId: activeChatId },
        orderBy: { createdAt: "asc" }
      })
    : [];

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden dir-rtl">
      
      <Sidebar chats={chats} />

      <main className="flex-1 flex flex-col bg-gray-900 relative w-full h-full">
        {/* کل منطق چت و اینپوت حالا در اینجاست */}
        <ChatScreen 
            key={activeChatId} // این کلید مهم است تا با تغییر چت، کامپوننت ریست شود
            chatId={activeChatId} 
            initialMessages={initialMessages.map(m => ({
                id: m.id,
                role: m.role as "user" | "assistant",
                content: m.content
            }))} 
        />
      </main>
    </div>
  );
}
