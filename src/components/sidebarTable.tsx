import { Actions, State, useStore } from '@/state'
import { useShallow } from 'zustand/react/shallow'
import { CreateDialog, DeleteDialog, SidebarColumn, Table } from '.'
import { AccordionContent, AccordionItem, AccordionTrigger } from './ui'

function selector(state: State & Actions) {
  return {
    createColumn: state.createColumn,
    removeTable: state.removeTable,
    columns: state.columns,
  }
}

export function SidebarTable({ table }: { table: Table }) {
  const { createColumn, removeTable, columns } = useStore(useShallow(selector))
  const tableColumns = columns
    .filter(c => c.tableId === table.id)
    .sort((a, b) => a.label.localeCompare(b.label))

  return (
    <AccordionItem
      value={table.id}
      key={table.id}
      className='border-b-zinc-800 border-b px-2'
    >
      <AccordionTrigger className='text-white'>
        {table.data.label}
      </AccordionTrigger>
      <AccordionContent className='pb-2'>
        {tableColumns.map((column, index) => (
          <SidebarColumn key={column.id} index={index} column={column} />
        ))}
        <div className='flex justify-between items-center mt-2'>
          <CreateDialog
            title='Create column'
            description={`Create column in ${table.data.label}`}
            onCreate={createColumn(table.id)}
          />
          <DeleteDialog
            title='Delete table'
            description={`Are you sure you want to delete ${table.data.label}? This action cannot be undone.`}
            onDelete={() => removeTable(table.id)}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
