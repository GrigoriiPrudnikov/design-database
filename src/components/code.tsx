'use client'

import { cn } from '@/lib/utils'
import { JetBrains_Mono } from 'next/font/google'
import { useState } from 'react'
import { Button, ScrollArea } from './ui'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
})

export default function Code({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    })
  }

  return (
    <ScrollArea
      className={cn(
        jetbrainsMono.className,
        'relative max-h-96 p-2 bg-zinc-900 text-sm rounded-md whitespace-pre-wrap break-all',
      )}
    >
      {code}
      <Button
        variant='outline'
        size='sm'
        className='absolute top-2 right-2'
        onClick={copy}
      >
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </ScrollArea>
  )
}
