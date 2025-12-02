// components/chat-input.tsx
"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { sendMessageWithId } from "@/app/actions"; // اتصال به اکشن جدید
import { useSearchParams } from "next/navigation"; // برای خواندن ID از آدرس

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      size="icon" 
      disabled={pending}
      className={`h-[46px] w-[46px] rounded-xl transition-all ${
        pending ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
      }`}
    >
      {pending ? (
        <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
      ) : (
        <Send className="w-5 h-5" />
      )}
    </Button>
  );
}

export default function ChatInput() {
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  
  // اگر در URL پارامتر id وجود داشته باشد آن را می‌خواند، وگرنه undefined می‌شود
  const chatId = searchParams.get("id") ?? undefined;

  return (
    <form 
      ref={formRef}
      action={async (formData) => {
        // ارسال پیام به همراه شناسه چت (اگر باشد)
        await sendMessageWithId(chatId, formData);
        
        // پاک کردن متن داخل اینپوت بعد از ارسال
        formRef.current?.reset();
      }} 
      className="max-w-3xl mx-auto relative flex gap-2"
    >
      <input
        name="content"
        type="text"
        placeholder="پیامی بنویسید..."
        autoComplete="off"
        className="flex-1 bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-gray-500 disabled:opacity-50"
      />
      <SubmitButton />
    </form>
  );
}
