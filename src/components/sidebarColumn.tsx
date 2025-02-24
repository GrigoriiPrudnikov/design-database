'use client'

import { cn } from '@/lib/utils'
import { Column } from '@/types'
import { JetBrains_Mono } from 'next/font/google'
import { ColumnProperties } from './columnProperties'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
})

interface Props {
  index: number
  column: Column
}

export function SidebarColumn({ index, column }: Props) {
  if (!column) return null

  return (
    <div className='flex justify-between items-center gap-2 min-h-10'>
      <div
        className={cn(
          jetbrainsMono.className,
          'flex justify-start items-center gap-2',
        )}
      >
        <div className='text-zinc-400 w-2'>{index}</div>
        <div className='text-white break-all max-w-full'>
          {column.label}{' '}
          <span className='text-zinc-400'>{column.isPrimaryKey && 'PK'}</span>
        </div>
      </div>
      <ColumnProperties column={column} />
    </div>
  )
}
