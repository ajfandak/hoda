import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { db } from "@/lib/db";

// تنظیم کلاینت برای OpenRouter
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  const { messages, chatId } = await req.json();

  // 1. ذخیره پیام کاربر در دیتابیس (اگر قبلاً ذخیره نشده باشد)
  // آخرین پیام، پیام جدید کاربر است
  const lastMessage = messages[messages.length - 1];
  
  // اطمینان از وجود chatId
  if (chatId) {
      await db.message.create({
        data: {
          content: lastMessage.content,
          role: "user",
          chatId: chatId,
        },
      });
  }

  // 2. درخواست به هوش مصنوعی
  const result = await streamText({
    model: openrouter("google/gemini-2.0-flash-exp:free"), // یا هر مدل دیگری که دارید
    messages,
    async onFinish({ text }) {
      // 3. ذخیره پاسخ هوش مصنوعی در دیتابیس پس از اتمام
      if (chatId && text) {
        await db.message.create({
          data: {
            content: text,
            role: "assistant",
            chatId: chatId,
          },
        });
      }
    },
  });

  return result.toDataStreamResponse();
}
