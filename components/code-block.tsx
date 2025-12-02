'use client';

import { FC, memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'; // تم وی‌اس‌کد
import { Check, Copy } from 'lucide-react';
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'; // این هوک را که قبلا دادم بسازید

interface CodeBlockProps {
  language: string;
  value: string;
}

export const CodeBlock: FC<CodeBlockProps> = memo(({ language, value }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(value);
  };

  return (
    <div className="relative w-full font-sans code-block my-4 rounded-lg overflow-hidden border border-zinc-800">
      <div className="flex items-center justify-between w-full px-4 py-2 bg-zinc-900 text-zinc-400 border-b border-zinc-800">
        <span className="text-xs lowercase font-mono">{language}</span>
        <button
          className="flex items-center gap-1 hover:text-zinc-100 transition-colors"
          onClick={onCopy}
        >
          {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          <span className="text-xs">{isCopied ? 'کپی شد' : 'کپی'}</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ margin: 0, borderRadius: 0, fontSize: '14px' }}
        PreTag="div"
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
});

CodeBlock.displayName = 'CodeBlock';
