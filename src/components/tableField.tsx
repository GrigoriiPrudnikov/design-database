'use client'

import { useAllConnections } from '@/hooks'
import { Field } from '@/types'
import { Position } from '@xyflow/react'
import { useState } from 'react'
import { CustomHandle } from '.'

export function TableField({ field }: { field: Field }) {
  const { id, label, type } = field
  const [hover, setHover] = useState<boolean>(false)

  const rightConnections = useAllConnections(`${id}_right`)
  const leftConnections = useAllConnections(`${id}_left`)
  const rightHidden = !(hover || rightConnections > 0) || leftConnections > 0
  const leftHidden = !(hover || leftConnections > 0) || rightConnections > 0

  return (
    <div
      className='px-2 py-1 relative'
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className='flex justify-between items-center gap-4'>
        <div className='break-all max-w-full'>{label}</div>
        <div>{type}</div>
      </div>
      <div>
        {leftConnections < 1 && (
          <CustomHandle
            type='source'
            position={Position.Right}
            id={`${id}_right`}
            className={rightHidden ? 'opacity-0' : ''}
          />
        )}
        {rightConnections < 1 && (
          <CustomHandle
            type='source'
            position={Position.Left}
            id={`${id}_left`}
            className={leftHidden ? 'opacity-0' : ''}
          />
        )}
      </div>
    </div>
  )
}
