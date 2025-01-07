'use client'

import { useState } from 'react'
import { TableNode } from './table'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from './ui'

interface Props {
  node: TableNode
  createField: (node: TableNode, label: string) => void
}

export function CreateFieldDialog({ node, createField }: Props) {
  const [label, setLabel] = useState<string>('Untitled field')
  const valid = label.length > 0

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='underline'>New field</button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create field</DialogTitle>
        <DialogHeader>
          <DialogDescription>
            Create field in table '{node.data.label}'
          </DialogDescription>
        </DialogHeader>
        <Input
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder='Untitled field'
        />
        <div className='flex justify-end'>
          <DialogClose asChild>
            <Button onClick={() => createField(node, label)} disabled={!valid}>
              Create
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
