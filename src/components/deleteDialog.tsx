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
} from './ui'

interface Props {
  title: string
  description: string
  onDelete: () => void
}

export function DeleteDialog({ title, description, onDelete }: Props) {
  const [open, setOpen] = useState<boolean>(false)

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
        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onDelete}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
