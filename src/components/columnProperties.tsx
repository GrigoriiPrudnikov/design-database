'use client'

import { Actions, State, useStore } from '@/state'
import { Column } from '@/types'
import { useShallow } from 'zustand/react/shallow'
import { ChangeProperty, DatatypeSelect, DeleteColumn, ToggleProperty } from '.'
import { Button, Popover, PopoverContent, PopoverTrigger } from './ui'
import { hasLimit } from '@/constants'

interface Props {
  column: Column
}

function selector(state: State & Actions) {
  return {
    updateColumn: state.updateColumn,
    updatePrimaryKey: state.setPrimaryKey,
  }
}

export function ColumnProperties({ column }: Props) {
  const { updateColumn, updatePrimaryKey } = useStore(useShallow(selector))

  function toggleProperty(property: 'isRequired' | 'isUnique' | 'isArray') {
    updateColumn(column.id, {
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
          placeholder={column.label}
          toChange='label'
        />
        <div className='flex flex-col gap-2'>
          <ToggleProperty
            label='Primary Key'
            value={column.isPrimaryKey}
            onToggle={() => updatePrimaryKey(column.id)}
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
          <ToggleProperty
            label='Array'
            value={column.isArray}
            onToggle={() => toggleProperty('isArray')}
            disabled={column.isPrimaryKey}
          />
          <DatatypeSelect column={column} />
          {hasLimit.includes(column.datatype) && (
            <ChangeProperty
              column={column}
              placeholder='Limit'
              toChange='limit'
            />
          )}
          {!column.isPrimaryKey && (
            <ChangeProperty
              column={column}
              placeholder='Default value'
              toChange='defaultValue'
            />
          )}
          <DeleteColumn column={column} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
