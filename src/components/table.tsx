import { Actions, State, useStore } from '@/state'
import { Node, NodeProps, useNodeId } from '@xyflow/react'
import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { NodeColumn } from '.'
import { Card } from './ui'

export type Table = Node<{ label: string }, 'table'>

function selector(state: State & Actions) {
  return {
    columns: state.columns,
  }
}

export function Table({ data }: NodeProps<Table>) {
  const id = useNodeId()
  const { label } = data
  const { columns } = useStore(useShallow(selector))
  const tableColumns = useMemo(
    () => columns.filter(c => c.tableId === id),
    [columns, id],
  )

  return (
    <Card className='min-w-32 max-w-44 rounded-md text-[0.5rem]'>
      <div className='flex justify-center items-center min-h-4'>{label}</div>
      <div className='flex flex-col py-1 border-t border-zinc-800'>
        {tableColumns.map(c => (
          <NodeColumn key={c.id} column={c} />
        ))}
      </div>
    </Card>
  )
}
