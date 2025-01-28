'use client'

import { useAllConnections } from '@/hooks'
import { Field } from '@/types'
import { Position } from '@xyflow/react'
import { useState } from 'react'
import { CustomHandle, RelationTypeToggle } from '.'

interface Props {
  field: Field
}

export function TableField({ field }: Props) {
  const { id, label, type } = field
  const [hover, setHover] = useState<boolean>(false)
  const rightConnections = useAllConnections(`${id}__right`)
  const leftConnections = useAllConnections(`${id}__left`)

  const rightConnectable =
    (hover || rightConnections > 0) && leftConnections === 0
  const leftConnectable =
    (hover || leftConnections > 0) && rightConnections === 0
  // TODO:
  // 1. Remove 1 connection per field resctriction
  // 2. Add invalid relations handling

  return (
    <div
      className='px-2 py-1 relative'
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className='flex justify-between items-center gap-4'>
        <div className='flex items-center gap-1'>
          <div className='break-all max-w-full'>{label}</div>
          <RelationTypeToggle fieldId={id} />
        </div>
        <div>{type}</div>
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
