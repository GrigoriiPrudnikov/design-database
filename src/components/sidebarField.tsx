'use client'

import { Field, FieldType } from '@/types'
import { Dispatch, SetStateAction, useState } from 'react'
import { TableNode } from './table'
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui'
import { CircleX, Minus } from 'lucide-react'

const DATA_TYPES = Object.values(FieldType) as string[]

interface Props {
  index: number
  field: Field
  node: TableNode
  setNodes: Dispatch<SetStateAction<TableNode[]>>
}

export function SidebarField({ index, field, node, setNodes }: Props) {
  function updateField(updates: Partial<Field>): void {
    const updatedNode: TableNode = {
      ...node,
      data: {
        ...node.data,
        fields: node.data.fields.map(f =>
          f.id === field.id ? { ...f, ...updates } : f,
        ),
      },
    }

    setNodes(nds => [...nds.filter(n => n.id !== node.id), updatedNode])
  }

  function removeField(): void {
    const updatedNode: TableNode = {
      ...node,
      data: {
        ...node.data,
        fields: node.data.fields.filter(f => f.id !== field.id),
      },
    }

    setNodes(nds => [...nds.filter(n => n.id !== node.id), updatedNode])
  }

  const [hover, setHover] = useState<boolean>(false)

  return (
    <div className='flex justify-between items-center gap-2 min-h-10'>
      <div
        className='flex justify-start items-center gap-2'
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {hover ? (
          <button
            className='text-zinc-400 transition-colors w-2'
            onClick={() => removeField()}
          >
            -
          </button>
        ) : (
          <div className='text-zinc-400 w-2'>{index}</div>
        )}
        <div className='text-white break-all max-w-full'>{field.label}</div>
      </div>
      <div className='flex justify-end items-center gap-2 flex-shrink-0'>
        <Select
          defaultValue={field.type}
          onValueChange={(type: FieldType) => updateField({ type })}
        >
          <SelectTrigger className='bg-zinc-950'>
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
          onClick={() => updateField({ isRequired: !field.isRequired })}
        >
          {field.isRequired ? 'Required' : 'Optional'}
        </Button>
      </div>
    </div>
  )
}
