import { Position } from '@xyflow/react'
import { HybridHandle } from './hybridHandle'

interface Props {
  data: {
    label: string
  }
}

export function Node({ data }: Props) {
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
      {/* <Handle
        type="target"
        position={Position.Top}
        style={{ bottom: -10, right: 10 }} // Custom offset for target handle
        id="target"
      /> */}
    </div>
  )
}
