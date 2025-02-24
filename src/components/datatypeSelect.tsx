import { Actions, State, useStore } from '@/state'
import { Column, Datatype } from '@/types'
import { useShallow } from 'zustand/react/shallow'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui'

interface Props {
  column: Column
}

const DATA_TYPES = Object.values(Datatype) as string[]

function selector(state: State & Actions) {
  return {
    updateColumn: state.updateColumn,
  }
}

export function DatatypeSelect({ column }: Props) {
  const { updateColumn } = useStore(useShallow(selector))

  return (
    <div className='flex justify-between items-center gap-2'>
      <Select
        defaultValue={column.datatype}
        onValueChange={(datatype: Datatype) =>
          updateColumn(column.id, { datatype })
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
