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

export function RelationTypeToggle({ fieldId }: { fieldId: string }) {
  const { relations, changeRelationType } = useStore(useShallow(selector))
  const relation = relations.find(
    rel => rel.source === fieldId || rel.target === fieldId,
  )

  if (!relation) return null

  const relationRole = relation.source === fieldId ? 'source' : 'target'
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
