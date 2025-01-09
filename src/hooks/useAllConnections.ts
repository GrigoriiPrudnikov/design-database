import { useHandleConnections } from '@xyflow/react'

export function useAllConnections(id: string): number {
  const sourceConnections = useHandleConnections({ type: 'source', id })
  const targetConnections = useHandleConnections({ type: 'target', id })

  const connections = [...sourceConnections, ...targetConnections]

  return connections.length
}
