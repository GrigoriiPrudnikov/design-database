'use client'

import { Actions, State, useStore } from '@/state'
import { Column } from '@/types'
import { useShallow } from 'zustand/react/shallow'
import { ChangeColumnName, DatatypeSelect, TableNode, ToggleProperty } from '.'
import { Button, Popover, PopoverContent, PopoverTrigger } from './ui'

interface Props {
  column: Column
  node: TableNode
}

function selector(state: State & Actions) {
  return {
    updateColumn: state.updateColumn,
    removeColumn: state.removeColumn,
    updatePrimaryKey: state.updatePrimaryKey,
  }
}

export function ColumnProperties({ column, node }: Props) {
  const { updateColumn, removeColumn, updatePrimaryKey } = useStore(
    useShallow(selector),
  )

  function toggleProperty(property: 'isRequired' | 'isUnique') {
    updateColumn(node, column.id, {
      [property]: !column[property],
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='sm' variant='outline' className='text-sm'>
          Properties
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side='right'
        align='center'
        className='flex flex-col gap-2'
      >
        <ChangeColumnName column={column} node={node} />
        <div className='flex flex-col gap-2'>
          <ToggleProperty
            label='Primary Key'
            value={column.isPrimaryKey}
            onToggle={() => updatePrimaryKey(node, column.id)}
            disabled={column.isPrimaryKey}
          />
          <ToggleProperty
            label='Unique'
            value={column.isUnique}
            onToggle={() => toggleProperty('isUnique')}
          />
          <ToggleProperty
            label='Required'
            value={column.isRequired}
            onToggle={() => toggleProperty('isRequired')}
          />
          <DatatypeSelect column={column} node={node} />
          {/* TODO: disabled delete button if column is primary key and add tooltip */}
          <Button variant='ghost' onClick={() => removeColumn(node, column.id)}>
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
