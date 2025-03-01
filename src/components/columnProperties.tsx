'use client'

import { hasLimit } from '@/constants'
import { validateDefaultValue } from '@/helpers'
import { Actions, State, useStore } from '@/state'
import { Column } from '@/types'
import { isInt } from 'validator'
import { useShallow } from 'zustand/react/shallow'
import { ChangeProperty, DatatypeSelect, DeleteColumn, ToggleProperty } from '.'
import { Button, Popover, PopoverContent, PopoverTrigger } from './ui'

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
  const { id, datatype, isPrimaryKey, isRequired, isUnique, isArray } = column

  function toggleProperty(property: 'isRequired' | 'isUnique' | 'isArray') {
    updateColumn(id, { [property]: !column[property] })
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
            value={isPrimaryKey}
            onToggle={() => updatePrimaryKey(column.id)}
            disabled={isPrimaryKey}
          />
          <ToggleProperty
            label='Unique'
            value={isUnique}
            onToggle={() => toggleProperty('isUnique')}
            disabled={isPrimaryKey}
          />
          <ToggleProperty
            label='Required'
            value={isRequired}
            onToggle={() => toggleProperty('isRequired')}
            disabled={isPrimaryKey}
          />
          <ToggleProperty
            label='Array'
            value={isArray}
            onToggle={() => toggleProperty('isArray')}
            disabled={isPrimaryKey}
          />
          <DatatypeSelect column={column} />
          {hasLimit.includes(datatype) && (
            <ChangeProperty
              column={column}
              placeholder='Limit'
              toChange='limit'
              validate={value =>
                isInt(value)
                  ? { error: null }
                  : { error: 'Not a valid integer.' }
              }
            />
          )}
          {!isPrimaryKey && (
            <ChangeProperty
              column={column}
              placeholder='Default value'
              toChange='defaultValue'
              validate={validateDefaultValue(datatype)}
            />
          )}
          <DeleteColumn column={column} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
