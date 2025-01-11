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
  create: (label: string) => void
  label: string
  title: string
  description: string
}

export function CreateDialog({ create, label, title, description }: Props) {
  const [input, setInput] = useState<string>('Untitled')
  const valid = label.length > 0

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='hover:underline'>{label}</button>
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
