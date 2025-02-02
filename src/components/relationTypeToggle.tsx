'use client'

import { Actions, State, useStore } from '@/state'
import { useShallow } from 'zustand/react/shallow'
import { Button } from './ui'

function selector(state: State & Actions) {
  return {
    relations: state.relations,
    changeRelationType: state.changeRelationType,
  }
}

export function RelationTypeToggle({ columnId }: { columnId: string }) {
  const { relations, changeRelationType } = useStore(useShallow(selector))
  const relation = relations.find(
    rel => rel.source === columnId || rel.target === columnId,
  )

  if (!relation) return null

  const relationRole = relation.source === columnId ? 'source' : 'target'
  const relationType =
    relationRole === 'target' ? relation.targetType : relation.sourceType

  return (
    <Button
      variant='outline'
      size='sm'
      className='h-3 px-1 text-[1em] text-zinc-700 dark:hover:text-zinc-400 flex justify-center items-center rounded-[2px]'
      onClick={() => changeRelationType(relation.id, relationRole)}
    >
      {relationType.toUpperCase()}
    </Button>
  )
}
