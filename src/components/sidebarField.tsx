'use client'

import { Actions, State, useStore } from '@/state'
import { Field, FieldType } from '@/types'
import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { TableNode } from './table'
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui'

const DATA_TYPES = Object.values(FieldType) as string[]

interface Props {
  index: number
  field: Field
  node: TableNode
}

function selector(state: State & Actions) {
  return {
    updateField: state.updateField,
    removeField: state.removeField,
  }
}

export function SidebarField({ index, field, node }: Props) {
  const { updateField, removeField } = useStore(useShallow(selector))
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
            onClick={() => removeField(node, field.id)}
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
          onValueChange={(type: FieldType) =>
            updateField(node, field.id, { type })
          }
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
          onClick={() =>
            updateField(node, field.id, { isRequired: !field.isRequired })
          }
        >
          {field.isRequired ? 'Required' : 'Optional'}
        </Button>
      </div>
    </div>
  )
}
