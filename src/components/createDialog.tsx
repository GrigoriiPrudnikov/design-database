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

export function CreateDialog({ title, description, create }: Props) {
  const [input, setInput] = useState<string>('Untitled')
  const valid = input.trim().length > 0

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='hover:underline'>{title}</button>
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
