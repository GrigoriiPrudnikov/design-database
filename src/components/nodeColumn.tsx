'use client'

import { useAllConnections } from '@/hooks'
import { cn } from '@/lib/utils'
import { Column } from '@/types'
import { Position } from '@xyflow/react'
import { JetBrains_Mono } from 'next/font/google'
import { useState } from 'react'
import { CustomHandle } from '.'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
})

interface Props {
  column: Column
}

export function NodeColumn({ column }: Props) {
  const { id, label, datatype, isArray, limit } = column
  const [hover, setHover] = useState<boolean>(false)
  const rightConnections = useAllConnections(`${id}__right`)
  const leftConnections = useAllConnections(`${id}__left`)

  const rightConnectable =
    (hover || rightConnections > 0) && leftConnections === 0
  const leftConnectable =
    (hover || leftConnections > 0) && rightConnections === 0
  // TODO:
  // 1. Remove 1 connection per column resctriction
  // 2. Add invalid relations handling (ivanlid datatype, etc)

  return (
    <div
      className={cn(jetbrainsMono.className, 'px-2 py-1 relative')}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className='flex justify-between items-center gap-4'>
        <div className='break-all max-w-full'>
          {label}{' '}
          <span className='text-zinc-400'>{column.isPrimaryKey && 'PK'}</span>
        </div>
        <div>
          {datatype}
          {limit && `(${limit})`}
          {isArray && '[]'}
        </div>
      </div>
      <div>
        <CustomHandle
          type='source'
          position={Position.Right}
          id={`${id}__right`}
          className={!rightConnectable ? 'opacity-0' : ''}
          isConnectable={rightConnectable}
        />
        <CustomHandle
          type='source'
          position={Position.Left}
          id={`${id}__left`}
          className={!leftConnectable ? 'opacity-0' : ''}
          isConnectable={leftConnectable}
        />
      </div>
    </div>
  )
}
