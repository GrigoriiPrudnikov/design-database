import { Field } from '@/types'
import { Node, NodeProps, Position } from '@xyflow/react'
import { HybridHandle } from './hybridHandle'

export type TableNode = Node<
  {
    label: string
    fields: Field[]
  },
  'table'
>

export function Table({ data }: NodeProps<TableNode>) {
  return (
    <div className="bg-zinc-500 rounded-sm">
      <div>{data.label}</div>

      {/* Handle at custom position */}
      <div className="min-h-12 relative">
        <HybridHandle position={Position.Right} id="source1" />
        <HybridHandle position={Position.Left} id="source12" />
      </div>
      <div className="min-h-12 relative">
        <HybridHandle position={Position.Right} id="source2" />
        <HybridHandle position={Position.Left} id="source22" />
      </div>
      <div className="min-h-12 relative">
        <HybridHandle position={Position.Right} id="source3" />
        <HybridHandle position={Position.Left} id="source32" />
      </div>
    </div>
  )
}
