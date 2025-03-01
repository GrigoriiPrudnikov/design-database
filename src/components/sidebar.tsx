'use client'

import { Accordion, ScrollArea } from '@/components/ui'
import { Actions, State, useStore } from '@/state'
import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { CreateDialog, SidebarTable } from '.'
import ExportQueryDialog from './exportQueryDialog'

function selector(state: State & Actions) {
  return {
    tables: state.tables,
    columns: state.columns,
    createTable: state.createTable,
  }
}

export function Sidebar() {
  const { tables, createTable } = useStore(useShallow(selector))
  const sortedTables = useMemo(
    () => tables.sort((a, b) => a.data.label.localeCompare(b.data.label)),
    [tables],
  )

  return (
    <div className='bg-zinc-950 h-screen max-w-[22.5vw] border-r border-zinc-800 flex flex-col z-10'>
      <ScrollArea className='h-full'>
        <Accordion type='multiple' className='w-full'>
          {sortedTables.map(t => (
            <SidebarTable key={t.id} table={t} />
          ))}
        </Accordion>
      </ScrollArea>
      <div className='px-1 bg-zinc-950 border-t border-zinc-800 w-full max-w-[22.5vw] h-12 flex justify-between items-center text-sm'>
        <CreateDialog
          onCreate={createTable}
          title='Create table'
          description='Create table, where you can add, edit, and remove columns'
        />
        <ExportQueryDialog />
      </div>
    </div>
  )
}
