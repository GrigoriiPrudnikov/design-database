import { Field, FieldType } from '@/types'
import { Dispatch, SetStateAction } from 'react'
import { TableNode } from './table'
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui'

const DATA_TYPES = Object.keys(FieldType) as Array<keyof typeof FieldType>

interface Props {
  index: number
  field: Field
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

  function setType(type: FieldType): void {
    const updatedNode: TableNode = {
      ...node,
      data: {
        ...node.data,
        fields: node.data.fields.map(f =>
          f.label === field.label ? { ...f, type } : f,
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
      <div className='flex justify-end items-center gap-2'>
        <Select
          defaultValue={field.type}
          onValueChange={type => setType(type as FieldType)}
        >
          <SelectTrigger>
            <SelectValue placeholder='' />
          </SelectTrigger>
          <SelectContent>
            {DATA_TYPES.map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size='sm'
          variant='outline'
          className='min-w-20'
          onClick={() => toggleIsRequired()}
        >
          {field.isRequired ? 'Required' : 'Optional'}
        </Button>
      </div>
    </div>
  )
}
