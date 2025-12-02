// components/chat-input.tsx
"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

// این دکمه هوشمند است و وضعیت در حال ارسال را میفهمد
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      size="icon" 
      disabled={pending}
      className="h-[46px] w-[46px] rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all"
    >
      {pending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Send className="w-5 h-5" />
      )}
    </Button>
  );
}

export function ChatInput({ action }: { action: (formData: FormData) => Promise<void> }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form 
      ref={formRef}
      action={async (formData) => {
        // فرم را ریست کن تا متن پاک شود
        formRef.current?.reset();
        // اکشن اصلی را صدا بزن
        await action(formData);
      }} 
      className="max-w-3xl mx-auto relative flex gap-2"
    >
      <input
        name="content"
        type="text"
        placeholder="پیامی بنویسید..."
        autoComplete="off"
        required
        className="flex-1 bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-gray-500 transition-all"
      />
      <SubmitButton />
    </form>
  );
}
