import { Column } from '@/types'
import { Node, NodeProps } from '@xyflow/react'
import { NodeColumn } from '.'
import { Card } from './ui'

export type TableNode = Node<
  {
    label: string
    columns: Column[]
  },
  'table'
>

export function Table({ data }: NodeProps<TableNode>) {
  const { label, columns } = data

  return (
    <Card className='min-w-32 max-w-44 rounded-md text-[0.5rem]'>
      <div className='flex justify-center items-center min-h-4'>{label}</div>
      <div className='flex flex-col py-1 border-t border-zinc-800'>
        {columns.map(c => (
          <NodeColumn key={c.id} column={c} />
        ))}
      </div>
    </Card>
  )
}
