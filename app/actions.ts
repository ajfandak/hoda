// app/actions.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// تابع کمکی برای ساخت عنوان
async function generateTitle(userMessage: string) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://hoda-platform.com",
        "X-Title": "Hoda Platform",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          {
            role: "system",
            content: "خلاصه‌ای بسیار کوتاه (حداکثر ۴ کلمه) از پیام کاربر به فارسی بساز تا به عنوان موضوع گفتگو استفاده شود. فقط متن عنوان را برگردان، بدون کوتیشن یا توضیحات اضافه."
          },
          { role: "user", content: userMessage }
        ],
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || "گفتگوی جدید";
  } catch (error) {
    console.error("Error generating title:", error);
    return "گفتگوی جدید";
  }
}

export async function sendMessage(formData: FormData) {
  const content = formData.get("content") as string;
  
  // خواندن chatId از آدرس صفحه (URL) یا فرم مخفی اگر بود
  // اما چون ما الان فرم ساده داریم، فرض می‌کنیم chatId را باید تشخیص دهیم
  // راه بهتر: chatId را از کلاینت بفرستیم.
  // فعلا بیایید منطق را کمی ساده کنیم:
  // ما نیاز داریم chatId را از ورودی بگیریم.
  // برای این کار باید فرم را در کلاینت اصلاح کنیم تا chatId را هم بفرستد.
  
  // *توجه:* چون فرم استاندارد HTML است، ما chatId را فعلا نداریم.
  // پس بیایید یک ترفند بزنیم: اگر chatId در فرم نبود، یعنی چت جدید است.
  // اما FormData فقط اینپوت‌ها را دارد.
  
  // اصلاح استراتژی: ما باید chatId را به عنوان ورودی مخفی (hidden input) در فرم داشته باشیم.
  // کد زیر فعلاً ناقص است تا زمانی که `chat-input` را آپدیت کنیم.
  // پس من کدی می‌نویسم که `chatId` را هم بگیرد.
}

// --- نسخه اصلاح شده و کامل sendMessage ---
export async function sendMessageWithId(chatId: string | undefined, formData: FormData) {
  const content = formData.get("content") as string;
  if (!content || !content.trim()) return;

  // ۱. پیدا کردن یا ساختن کاربر (موقت)
  let user = await db.user.findUnique({ where: { email: "user@example.com" } });
  if (!user) {
    user = await db.user.create({
      data: { email: "user@example.com" }
    });
  }

  // ۲. مدیریت چت (جدید یا قدیمی)
  let chat;
  let isNewChat = false;

  if (chatId) {
    chat = await db.chat.findUnique({ where: { id: chatId } });
  }

  if (!chat) {
    isNewChat = true;
    chat = await db.chat.create({
      data: { userId: user.id, title: "گفتگوی جدید..." }
    });
  }

  // ۳. ذخیره پیام کاربر
  await db.message.create({
    data: { chatId: chat.id, role: "user", content }
  });

  // ۴. اگر چت جدید است، عنوان بساز
  if (isNewChat) {
    // این را غیرهمگام اجرا می‌کنیم تا کاربر منتظر نماند (Fire and Forget)
    generateTitle(content).then(async (title) => {
        if(chat) { // Check if chat exists to satisfy TS
            await db.chat.update({
            where: { id: chat.id },
            data: { title }
            });
            revalidatePath("/");
        }
    });
  }

  // ۵. ارسال به هوش مصنوعی
  try {
    // دریافت تاریخچه کوتاه برای کانتکست
    const history = await db.message.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: "asc" },
      take: 6 // ۳ پیام آخر (رفت و برگشت)
    });

    const apiMessages = history.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://hoda-platform.com",
        "X-Title": "Hoda Platform",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
            { role: "system", content: "You are a helpful AI assistant named Hoda. Answer in Persian (Farsi)." },
            ...apiMessages
        ],
      }),
    });

    const data = await response.json();
    const botMessage = data.choices?.[0]?.message?.content || "خطایی رخ داد.";

    // ۶. ذخیره پاسخ ربات
    await db.message.create({
      data: { chatId: chat.id, role: "assistant", content: botMessage }
    });

  } catch (error) {
    console.error("AI Error:", error);
    await db.message.create({
      data: { chatId: chat.id, role: "assistant", content: "متاسفانه در اتصال به هوش مصنوعی مشکلی پیش آمد." }
    });
  }

  revalidatePath("/");
  
  // اگر چت جدید بود، ریدایرکت کن به صفحه همان چت
  if (isNewChat) {
    redirect(`/?id=${chat.id}`);
  }
}
