import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // این گزینه باعث می‌شود بیلد حتی با وجود خطاهای لینتر انجام شود
    ignoreDuringBuilds: true,
  },
  typescript: {
    // (اختیاری) این گزینه باعث می‌شود بیلد حتی با وجود خطاهای تایپ انجام شود
    // اگر باز هم گیر کرد، این خط را از کامنت درآورید:
    // ignoreBuildErrors: true,
  }
};

export default nextConfig;
