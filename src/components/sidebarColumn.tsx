'use client'

import { Column } from '@/types'
import { ColumnProperties } from './columnProperties'
import { TableNode } from './table'

interface Props {
  index: number
  column: Column
  node: TableNode
}

export function SidebarColumn({ index, column, node }: Props) {
  if (!column) return null

  return (
    <div className='flex justify-between items-center gap-2 min-h-10'>
      <div className='flex justify-start items-center gap-2'>
        <div className='text-zinc-400 w-2'>{index}</div>
        <div className='text-white break-all max-w-full'>
          {column.label}{' '}
          <span className='text-zinc-400'>{column.isPrimaryKey && 'PK'}</span>
        </div>
      </div>
      <ColumnProperties column={column} node={node} />
    </div>
  )
}
