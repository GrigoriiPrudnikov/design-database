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
}

function selector(state: State & Actions) {
  return {
    updateColumn: state.updateColumn,
  }
}

// TODO: confirm on enter

export function ChangeColumnName({ column, node }: Props) {
  const { updateColumn } = useStore(useShallow(selector))
  const [input, setInput] = useState<string>(column.label)
  const disabled = input.trim() === column.label

  return (
    <div className='flex items-center gap-2'>
      <Input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={column.label}
      />
      <Button
        variant='outline'
        size='icon'
        disabled={disabled}
        onClick={() => updateColumn(node, column.id, { label: input })}
      >
        <RefreshCw className='h-4 w-4' />
      </Button>
    </div>
  )
}
