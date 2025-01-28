import { Actions, State, useStore } from '@/state'
import { useShallow } from 'zustand/react/shallow'
import { CreateDialog, SidebarField, TableNode } from '.'
import { AccordionContent, AccordionItem, AccordionTrigger } from './ui'

function selector(state: State & Actions) {
  return {
    createField: state.createField,
    removeTable: state.removeTable,
  }
}

export function SidebarNode({ node }: { node: TableNode }) {
  const { createField, removeTable } = useStore(useShallow(selector))

  return (
    <AccordionItem
      value={node.id}
      key={node.id}
      className='border-b-zinc-800 border-b px-2'
    >
      <AccordionTrigger className='text-white'>
        {node.data.label}
      </AccordionTrigger>
      <AccordionContent>
        {node.data.fields &&
          node.data.fields.map((field, index) => (
            <SidebarField
              key={field.id}
              index={index}
              field={field}
              node={node}
            />
          ))}
        <div className='flex justify-between items-center'>
          <CreateDialog
            key={node.id}
            title='Create field'
            description={`Create field in table '${node.data.label}'`}
            create={createField(node)}
          />
          <button
            className='hover:underline'
            onClick={() => removeTable(node.id)}
          >
            Delete table
          </button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
