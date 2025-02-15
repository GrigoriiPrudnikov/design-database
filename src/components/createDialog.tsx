'use client'

import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from './ui'

interface Props {
  title: string
  description: string
  onCreate: (label: string) => void
}

// TODO:
// 1. confirm on enter
// 2. if column is single in table, make it primary key

export function CreateDialog({ title, description, onCreate }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const [input, setInput] = useState<string>('Untitled')
  const valid = input.trim().length > 0
  function onConfirm(): void {
    onCreate(input)
    setInput('Untitled')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost'>{title}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogHeader>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onConfirm()}
          placeholder='Untitled'
        />
        <div className='flex justify-end'>
          <Button onClick={onConfirm} disabled={!valid}>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
