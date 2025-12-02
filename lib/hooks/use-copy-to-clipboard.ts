'use client'

import { useState, useEffect } from 'react'

export function useCopyToClipboard({
  timeout = 2000
}: {
  timeout?: number
}) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = (value: string) => {
    if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
      return
    }
    if (!value) {
      return
    }
    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true)
    })
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    if (isCopied) {
      timeoutId = setTimeout(() => {
        setIsCopied(false)
      }, timeout)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isCopied, timeout])

  return { isCopied, copyToClipboard }
}
