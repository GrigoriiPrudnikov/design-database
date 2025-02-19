'use client'

import { validateDefaultValue } from '@/helpers'
import { Actions, State, useStore } from '@/state'
import { Column } from '@/types'
import { RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
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

  useEffect(() => {
    setInput('')
  }, [column.datatype])

  function onConfirm() {
    let valid = true
    let error = ''

    if (toChange === 'defaultValue') {
      const validationResult = validateDefaultValue(input, column.datatype)
      valid = validationResult.valid
      error = validationResult.error || ''
    }

    if (!valid && input.trim() !== '') {
      return toast.error(error)
    }

    updateColumn(node, column.id, { [toChange]: input })
  }

  return (
    <div className='flex items-center gap-2'>
      <Input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onConfirm()}
        placeholder={placeholder}
      />
      <Button
        variant='outline'
        size='icon'
        disabled={disabled}
        onClick={() => onConfirm()}
      >
        <RefreshCw className='h-4 w-4' />
      </Button>
    </div>
  )
}
