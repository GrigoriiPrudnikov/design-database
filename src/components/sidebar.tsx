'use client'

import { Accordion, AccordionContent, AccordionItem } from '@/components/ui'
import dynamic from 'next/dynamic'
import { Dispatch, SetStateAction } from 'react'
import { SidebarField } from './sidebarField'
import { TableNode } from './table'

const AccordionTrigger = dynamic(
  () => import('./ui').then(mod => mod.AccordionTrigger),
  { ssr: false },
)

interface Props {
  nodes: TableNode[]
  setNodes: Dispatch<SetStateAction<TableNode[]>>
}

export function Sidebar({ nodes, setNodes }: Props) {
  return (
    <div className='bg-zinc-950 h-full border-r border-zinc-800'>
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
                    key={field.label}
                    index={index}
                    field={field}
                    node={node}
                    setNodes={setNodes}
                  />
                ))}
              <button className='underline'>New field</button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
