import { Field as FieldType } from '@/types'
import { Dispatch, SetStateAction } from 'react'
import { TableNode } from './table'
import { Button } from './ui'

interface Props {
  index: number
  field: FieldType
  node: TableNode
  setNodes: Dispatch<SetStateAction<TableNode[]>>
}

export function SidebarField({ index, field, node, setNodes }: Props) {
  function toggleIsRequired(): void {
    const updatedNode: TableNode = {
      ...node,
      data: {
        ...node.data,
        fields: node.data.fields.map(f =>
          f.label === field.label ? { ...f, isRequired: !f.isRequired } : f,
        ),
      },
    }

    setNodes(nds => [...nds.filter(n => n.id !== node.id), updatedNode])
  }

  return (
    <div className='flex justify-between items-center h-10'>
      <div className='flex justify-start gap-2'>
        <div className='text-zinc-400'>{index}</div>
        <div className='text-white'>{field.label}</div>
      </div>
      <Button
        size='sm'
        variant='outline'
        className='w-20'
        onClick={() => toggleIsRequired()}
      >
        {field.isRequired ? 'Required' : 'Optional'}
      </Button>
    </div>
  )
}
