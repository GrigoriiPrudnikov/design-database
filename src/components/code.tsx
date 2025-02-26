import { cn } from '@/lib/utils'
import { Copy } from 'lucide-react'
import { JetBrains_Mono } from 'next/font/google'
import { Button, ScrollArea } from './ui'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
})

export default function Code({ code }: { code: string }) {
  function copy() {}

  return (
    <ScrollArea
      className={cn(
        jetbrainsMono.className,
        'relative max-h-96 p-2 bg-zinc-900 text-sm rounded-md whitespace-pre-wrap break-all',
      )}
    >
      {code}
      <Button variant='outline' size='icon' className='absolute top-2 right-2'>
        <Copy className='h-4 w-4 text-white' />
      </Button>
    </ScrollArea>
  )
}
