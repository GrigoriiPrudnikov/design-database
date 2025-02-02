import { Actions, State, useStore } from '@/state'
import { useShallow } from 'zustand/react/shallow'
import { CreateDialog, SidebarColumn, TableNode } from '.'
import { AccordionContent, AccordionItem, AccordionTrigger, Button } from './ui'

function selector(state: State & Actions) {
  return {
    createColumn: state.createColumn,
    removeTable: state.removeTable,
  }
}

export function SidebarTable({ node }: { node: TableNode }) {
  const { createColumn, removeTable } = useStore(useShallow(selector))

  return (
    <AccordionItem
      value={node.id}
      key={node.id}
      className='border-b-zinc-800 border-b px-2'
    >
      <AccordionTrigger className='text-white'>
        {node.data.label}
      </AccordionTrigger>
      <AccordionContent className='pb-2'>
        {node.data.columns &&
          node.data.columns.map((column, index) => (
            <SidebarColumn
              key={column.id}
              index={index}
              column={column}
              node={node}
            />
          ))}
        <div className='flex justify-between items-center mt-2'>
          <CreateDialog
            key={node.id}
            title='Create column'
            description={`Create column in table '${node.data.label}'`}
            create={createColumn(node)}
          />
          <Button variant='ghost' onClick={() => removeTable(node.id)}>
            Delete table
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
