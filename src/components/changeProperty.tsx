'use client'

import { Actions, State, useStore } from '@/state'
import { Column } from '@/types'
import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { TableNode } from '.'
import { Button, Input } from './ui'

interface Props {
  column: Column
  node: TableNode
  placeholder: string
  toChange: 'label' | 'defaultValue'
}

function selector(state: State & Actions) {
  return {
    updateColumn: state.updateColumn,
  }
}

export function ChangeProperty({ column, node, placeholder, toChange }: Props) {
  const { updateColumn } = useStore(useShallow(selector))
  const [input, setInput] = useState<string>(column[toChange] || '')
  const disabled = input.trim() === column[toChange]

  return (
    <div className='flex items-center gap-2'>
      <Input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e =>
          e.key === 'Enter' &&
          updateColumn(node, column.id, { [toChange]: input })
        }
        placeholder={placeholder}
      />
      <Button
        variant='outline'
        size='icon'
        disabled={disabled}
        onClick={() => updateColumn(node, column.id, { [toChange]: input })}
      >
        <RefreshCw className='h-4 w-4' />
      </Button>
    </div>
  )
}
