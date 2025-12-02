    // components/markdown.tsx
    'use client'

    import { memo } from 'react'
    import ReactMarkdown, { type Options } from 'react-markdown'
    import remarkGfm from 'remark-gfm'
    import { CodeBlock } from '@/components/code-block'

    // کامپوننت memo شده برای جلوگیری از رندر مجدد غیرضروری
    export const MemoizedReactMarkdown = memo(
      (props: Options) => {
        return (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // اینجا کامپوننت سفارشی CodeBlock را برای تگ `code` مپ می‌کنیم
              code(codeProps) {
                const { children, className, node, ...rest } = codeProps
                const match = /language-(\w+)/.exec(className || '')

                // اگر بلاک کد بود (نه inline) و زبان مشخص شده بود
                if (match) {
                  return (
                    <CodeBlock
                      language={match[1]}
                      value={String(children).replace(/\n$/, '')}
                      {...rest}
                    />
                  )
                }

                // برای کدهای inline یا بدون زبان مشخص
                return (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                )
              }
            }}
            {...props}
          />
        )
      },
      // تابع مقایسه برای memo: فقط در صورت تغییر محتوا، رندر مجدد انجام شود
      (prevProps, nextProps) =>
        prevProps.children === nextProps.children &&
        prevProps.className === nextProps.className
    )

    // تنظیم نام نمایشی برای دیباگینگ بهتر در React DevTools
    MemoizedReactMarkdown.displayName = 'MemoizedReactMarkdown'
