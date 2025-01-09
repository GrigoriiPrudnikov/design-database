import { Field } from '@/types'
import { Node, NodeProps } from '@xyflow/react'
import { Card } from './ui'
import { TableField } from '.'

export type TableNode = Node<
  {
    label: string
    fields: Field[]
  },
  'table'
>

export function Table({ data }: NodeProps<TableNode>) {
  const { label, fields } = data

  return (
    <Card className='min-w-32 max-w-44 rounded-md text-[0.5rem]'>
      <div className='flex justify-center items-center min-h-4'>{label}</div>
      <div className='flex flex-col py-1 border-t border-zinc-800'>
        {fields.map(f => (
          <TableField key={f.id} field={f} />
        ))}
      </div>
    </Card>
  )
}
