"use server";

import { db } from "@/lib/db";

// دریافت یا ساخت کاربر تستی
export async function getOrCreateUser() {
  const email = "user@example.com";

  let user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await db.user.create({
      data: { 
        email: "user@example.com"
      } 
    });
  }

  return user;
}

// دریافت لیست چت‌های یک کاربر
export async function getChats(userId: string) {
  try {
    const chats = await db.chat.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    return chats;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
}
