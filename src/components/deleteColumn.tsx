import { Actions, State, useStore } from '@/state'
import { Column } from '@/types'
import { useShallow } from 'zustand/react/shallow'
import { TableNode } from '.'
import { Button } from './ui'

interface Props {
  column: Column
  node: TableNode
}

function selector(state: State & Actions) {
  return {
    removeColumn: state.removeColumn,
  }
}

export function DeleteColumn({ column, node }: Props) {
  const { removeColumn } = useStore(useShallow(selector))
  const disabled = column.isPrimaryKey

  return (
    <Button
      variant='ghost'
      onClick={() => removeColumn(node, column.id)}
      disabled={disabled}
    >
      {disabled ? 'you cannot delete primary key' : 'Delete'}
    </Button>
  )
}
