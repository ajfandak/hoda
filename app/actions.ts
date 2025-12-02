"use server";

import { db } from "@/lib/db";

export async function getOrCreateUser() {
  // فعلاً یک ایمیل ثابت برای تست استفاده می‌کنیم
  // در آینده می‌توانید سیستم لاگین واقعی اضافه کنید
  const email = "user@example.com";

  let user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await db.user.create({
      data: { 
        email: "user@example.com" 
        // فیلد name حذف شد چون در دیتابیس نیست
      } 
    });
  }

  return user;
}
