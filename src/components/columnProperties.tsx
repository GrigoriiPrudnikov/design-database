'use client'

import { Actions, State, useStore } from '@/state'
import { Column } from '@/types'
import { useShallow } from 'zustand/react/shallow'
import {
    ChangeProperty,
    DatatypeSelect,
    DeleteColumn,
    TableNode,
    ToggleProperty,
} from '.'
import { Button, Popover, PopoverContent, PopoverTrigger } from './ui'

interface Props {
  column: Column
  node: TableNode
}

function selector(state: State & Actions) {
  return {
    updateColumn: state.updateColumn,
    updatePrimaryKey: state.updatePrimaryKey,
  }
}

export function ColumnProperties({ column, node }: Props) {
  const { updateColumn, updatePrimaryKey } = useStore(useShallow(selector))

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
        <ChangeProperty
          column={column}
          node={node}
          placeholder={column.label}
          toChange='label'
        />
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
            disabled={column.isPrimaryKey}
          />
          <ToggleProperty
            label='Required'
            value={column.isRequired}
            onToggle={() => toggleProperty('isRequired')}
            disabled={column.isPrimaryKey}
          />
          <DatatypeSelect column={column} node={node} />
          {!column.isPrimaryKey && (
            <ChangeProperty
              column={column}
              node={node}
              placeholder='Default value'
              toChange='defaultValue'
            />
          )}
          <DeleteColumn column={column} node={node} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
