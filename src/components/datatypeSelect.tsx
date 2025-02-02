import { Actions, State, useStore } from '@/state'
import { Column, ColumnType } from '@/types'
import { useShallow } from 'zustand/react/shallow'
import { TableNode } from '.'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui'

interface Props {
  column: Column
  node: TableNode
}

const DATA_TYPES = Object.values(ColumnType) as string[]

function selector(state: State & Actions) {
  return {
    updateColumn: state.updateColumn,
  }
}

export function DatatypeSelect({ column, node }: Props) {
  const { updateColumn } = useStore(useShallow(selector))

  return (
    <div className='flex justify-between items-center gap-2'>
      <Select
        defaultValue={column.datatype}
        onValueChange={(datatype: ColumnType) =>
          updateColumn(node, column.id, { datatype })
        }
      >
        <SelectTrigger className='bg-zinc-950 w-fit'>
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
      <div className='text-sm'>Datatype</div>
    </div>
  )
}
