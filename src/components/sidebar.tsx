'use client'

import { Accordion, Button, ScrollArea } from '@/components/ui'
import { Actions, State, useStore } from '@/state'
import { useShallow } from 'zustand/react/shallow'
import { CreateDialog, SidebarTable } from '.'

function selector(state: State & Actions) {
  return {
    nodes: state.nodes,
    createTable: state.createTable,
  }
}

export function Sidebar() {
  const { nodes, createTable } = useStore(useShallow(selector))

  return (
    <div className='bg-zinc-950 h-screen max-w-[22.5vw] border-r border-zinc-800 flex flex-col z-10'>
      <ScrollArea className='h-full'>
        <Accordion type='multiple' className='w-full'>
          {nodes.map(n => (
            <SidebarTable key={n.id} node={n} />
          ))}
        </Accordion>
      </ScrollArea>
      <div className='px-1 bg-zinc-950 border-t border-zinc-800 w-full max-w-[22.5vw] h-12 flex justify-between items-center text-sm'>
        <CreateDialog
          create={createTable}
          title='Create table'
          description='Create table, where you can add, edit, and remove columns'
        />
        <Button variant='ghost'>Export query</Button>
      </div>
    </div>
  )
}
