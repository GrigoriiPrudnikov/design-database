'use client'

import { createQuery } from '@/helpers'
import { Actions, State, useStore } from '@/state'
import { useState } from 'react'
import { toast } from 'sonner'
import { useShallow } from 'zustand/react/shallow'
import Code from './code'
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from './ui'

function selector(state: State & Actions) {
  return {
    tables: state.tables,
    columns: state.columns,
    relations: state.relations,
  }
}

export default function ExportQueryDialog() {
  const { tables, columns, relations } = useStore(useShallow(selector))
  const [query, setQuery] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)

  function exportQuery() {
    const { query: q, error } = createQuery({ tables, columns, relations })
    if (error) {
      toast.error(error)
      return
    }
    setQuery(q)
    setOpen(true)
  }

  return (
    <>
      <Button variant='ghost' onClick={exportQuery}>
        Export query
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export query</DialogTitle>
          </DialogHeader>
          <Code code={query} />
        </DialogContent>
      </Dialog>
    </>
  )
}
