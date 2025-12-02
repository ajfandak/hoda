// فایل: components/chat-input.tsx

'use client';

import * as React from 'react';
import Textarea from 'react-textarea-autosize';

import { useEnterSubmit } from '@/lib/hooks/use-enter-submit';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { IconArrowElbow } from '@/components/ui/icons';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading
}: ChatInputProps) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4"
              type="submit"
              disabled={isLoading || input === ''}
            >
              <IconArrowElbow />
              <span className="sr-only">Send message</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>ارسال پیام</TooltipContent>
        </Tooltip>
        
        {/* ===== تغییرات در اینجا اعمال شده است ===== */}
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={handleInputChange}
          placeholder="پیام خود را بنویسید..."
          spellCheck={false}
          // 1. اضافه کردن dir="rtl" برای پشتیبانی از زبان فارسی
          // 2. اضافه کردن pl-12 برای ایجاد فاصله از دکمه سمت چپ
          dir="rtl"
          className={cn(
            'w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm',
            'pl-12 pr-4 md:pl-12 md:pr-4' // اطمینان از وجود پدینگ در چپ
          )}
        />
        {/* ============================================= */}

      </div>
    </form>
  );
}
