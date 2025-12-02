import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// تنظیم کلاینت OpenRouter
const openai = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    // استفاده از مدل 'auto' برای انتخاب خودکار بهترین مدل موجود
    model: openai('openrouter/auto'),
    messages,
  });

  return result.toDataStreamResponse();
}
