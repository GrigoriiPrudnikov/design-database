import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  ScrollArea,
} from '@/components/ui'
import { FieldType } from '@/types'
import { nanoid } from 'nanoid'
import { Dispatch, SetStateAction } from 'react'
import { CreateDialog } from './createDialog'
import { SidebarField } from './sidebarField'
import { TableNode } from './table'
import { calcNodePosition } from '@/helpers'

interface Props {
  nodes: TableNode[]
  setNodes: Dispatch<SetStateAction<TableNode[]>>
}

export function Sidebar({ nodes, setNodes }: Props) {
  function createField(node: TableNode): (l: string) => void {
    return (label: string): void => {
      const found = node.data.fields.find(f => f.label === toSnakeCase(label))

      if (found) return

      const updatedNode: TableNode = {
        ...node,
        data: {
          ...node.data,
          fields: [
            ...node.data.fields,
            {
              label: toSnakeCase(label),
              id: nanoid(),
              type: FieldType.INT,
              isRequired: true,
            },
          ],
        },
      }

      setNodes(nds => [...nds.filter(n => n.id !== node.id), updatedNode])
    }
  }

  function createTable(label: string): void {
    const found = nodes.find(n => n.data.label === toSnakeCase(label))

    if (found) return

    const newTable: TableNode = {
      id: nanoid(),
      type: 'table',
      position: calcNodePosition(nodes),
      data: {
        label: toSnakeCase(label),
        fields: [],
      },
    }

    setNodes(nds => [...nds, newTable])
  }

  function removeTable(id: string): void {
    setNodes(nds => nds.filter(n => n.id !== id))
  }

  function toSnakeCase(str: string) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+|[-]+/g, '_')
      .toLowerCase()
  }

  return (
    <div className='bg-zinc-950 h-screen max-w-[22.5vw] border-r border-zinc-800 flex flex-col'>
      <ScrollArea className='h-full'>
        <Accordion type='multiple' className='w-full'>
          {nodes.map(node => (
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
                      setNodes={setNodes}
                    />
                  ))}
                <div className='flex justify-between items-center'>
                  <CreateDialog
                    key={node.id}
                    create={createField(node)}
                    label='New field'
                    title='Create field'
                    description={`Create field in table '${node.data.label}'`}
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
          ))}
        </Accordion>
      </ScrollArea>
      <div className='px-2 bg-zinc-950 border-t border-zinc-800 w-full max-w-[22.5vw] h-12 flex justify-between items-center text-sm'>
        <CreateDialog
          create={createTable}
          label='Create table'
          title='Create table'
          description='Create table, where u can add, edit, and remove fields'
        />
        <Button variant='link'>Export query (postgres)</Button>
      </div>
    </div>
  )
}
