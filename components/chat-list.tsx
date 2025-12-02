// فایل: components/chat-list.tsx

import { type Message } from 'ai/react';
// نکته: ما کامپوننت ChatMessage را بعدا می‌سازیم یا از ChatScreen استفاده می‌کنیم
// برای فعلا فقط یک div ساده می‌گذاریم تا خطاها رفع شوند.
// در ساختار فعلی، این کامپوننت حتی استفاده هم نمی‌شود.

export interface ChatListProps {
  messages: Message[];
}

export function ChatList({ messages }: ChatListProps) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index} className="pb-4">
          <strong>{message.role === 'user' ? 'User' : 'AI'}: </strong>
          {message.content}
        </div>
      ))}
    </div>
  );
}
