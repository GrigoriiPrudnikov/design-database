'use client'

import {
  addEdge,
  applyNodeChanges,
  Edge,
  Node as NodeType,
  NodeTypes,
  OnConnect,
  OnNodesChange,
  OnReconnect,
  ReactFlow,
  ReactFlowProps,
  reconnectEdge,
} from '@xyflow/react'
import { Node } from '.'

import '@xyflow/react/dist/style.css'
import { useCallback, useRef } from 'react'
import { useLocalStorage } from 'usehooks-ts'

const initialNodes: NodeType[] = [
  {
    id: '1',
    position: { x: 500, y: 400 },
    data: { label: 'Node 1' },
    draggable: true,
    type: 'table',
  },
  {
    id: '12',
    position: { x: 300, y: 400 },
    data: { label: 'Node 1' },
    draggable: true,
    type: 'table',
  },
]

const nodeTypes: NodeTypes = { table: Node }
const defaultEdgeOptions: Partial<Edge> = {
  animated: false,
  reconnectable: true,
  deletable: true,
}

export function Canvas() {
  const [nodes, setNodes, removeNodes] = useLocalStorage<NodeType[]>(
    'nodes',
    initialNodes,
  )
  const [edges, setEdges, removeEdges] = useLocalStorage<Edge[]>('edges', [])
  const [connections, setConnections, removeConnections] = useLocalStorage(
    'connections',
    [],
  )
  const edgeReconnectSuccessful = useRef(true)

  const onNodesChange: OnNodesChange = useCallback(
    changes => setNodes(nds => applyNodeChanges(changes, nds)),
    [setNodes],
  )
  const onConnect: OnConnect = useCallback(
    connection => setEdges(eds => addEdge(connection, eds)),
    [setEdges],
  )
  const onReconnectStart: ReactFlowProps['onReconnectStart'] =
    useCallback(() => {
      edgeReconnectSuccessful.current = false
    }, [])
  const onReconnect: OnReconnect = useCallback((oldEdge, newConnection) => {
    edgeReconnectSuccessful.current = true
    setEdges(els => reconnectEdge(oldEdge, newConnection, els))
  }, [])

  const onReconnectEnd: ReactFlowProps['onReconnectEnd'] = useCallback(
    (_event: unknown, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges(eds => eds.filter(e => e.id !== edge.id))
      }
      edgeReconnectSuccessful.current = true
    },
    [],
  )

  return (
    <ReactFlow
      className="h-full !bg-zinc-950"
      colorMode="dark"
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onConnect={onConnect}
      onReconnect={onReconnect}
      onReconnectStart={onReconnectStart}
      onReconnectEnd={onReconnectEnd}
      defaultEdgeOptions={defaultEdgeOptions}
      nodeTypes={nodeTypes}
      fitView
    />
  )
}
