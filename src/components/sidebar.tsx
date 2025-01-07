import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui'
import { FieldType } from '@/types'
import { nanoid } from 'nanoid'
import { Dispatch, SetStateAction } from 'react'
import { CreateFieldDialog } from './createFieldDialog'
import { SidebarField } from './sidebarField'
import { TableNode } from './table'

interface Props {
  nodes: TableNode[]
  setNodes: Dispatch<SetStateAction<TableNode[]>>
}

export function Sidebar({ nodes, setNodes }: Props) {
  function createField(node: TableNode, label: string): void {
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

  function toSnakeCase(str: string) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+|[-]+/g, '_')
      .toLowerCase()
  }

  return (
    <div className='bg-zinc-950 h-full max-w-[22.5vw] border-r border-zinc-800'>
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
              <CreateFieldDialog
                key={node.id}
                node={node}
                createField={createField}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
