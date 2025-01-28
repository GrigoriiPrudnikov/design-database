import { useNodeConnections } from '@xyflow/react'

export function useAllConnections(handleId: string): number {
  const sourceConnections = useNodeConnections({
    handleType: 'source',
    handleId,
  })
  const targetConnections = useNodeConnections({
    handleType: 'target',
    handleId,
  })

  const connections = [...sourceConnections, ...targetConnections]

  return connections.length
}
