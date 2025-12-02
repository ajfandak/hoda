// فایل: components/chat-input.tsx
import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { IconArrowElbow } from '@/components/ui/icons'

export interface ChatInputProps
  extends Omit<React.ComponentProps<'div'>, 'onSubmit'> {
  input: string
  setInput: (value: string) => void
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  isLoading,
  className,
  ...props
}: ChatInputProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        if (!input?.trim()) return
        await onSubmit(input)
        setInput('')
      }}
      ref={formRef}
    >
      <div
        className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12"
        {...props}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4"
              disabled={isLoading}
            >
              <IconArrowElbow />
              <span className="sr-only">ارسال پیام</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>ارسال پیام</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="پیام خود را اینجا بنویسید..."
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          dir="rtl" // برای حل مشکل تداخل راست‌چین
        />
        <div className="absolute right-0 top-4 sm:right-4">
          {/* اینجا می‌توانید دکمه‌های دیگری مثل توقف را اضافه کنید */}
        </div>
      </div>
    </form>
  )
}
