'use client'

import { useState } from 'react'
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
  title: string
  description: string
  create: (label: string) => void
}

// TODO:
// 1. confirm on enter
// 2. if column is single in table, make it primary key

export function CreateDialog({ title, description, create }: Props) {
  const [input, setInput] = useState<string>('Untitled')
  const valid = input.trim().length > 0

  return (
    <Dialog>
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
          placeholder='Untitled'
        />
        <div className='flex justify-end'>
          <DialogClose asChild>
            <Button
              onClick={() => {
                create(input)
                setInput('Untitled')
              }}
              disabled={!valid}
            >
              Create
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
