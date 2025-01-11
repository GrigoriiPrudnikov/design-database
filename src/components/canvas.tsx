'use client'

import { FieldType } from '@/types'
import {
  addEdge,
  applyNodeChanges,
  ConnectionMode,
  type Edge,
  NodeTypes,
  OnConnect,
  OnNodesChange,
  OnReconnect,
  ReactFlow,
  ReactFlowProps,
  reconnectEdge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { nanoid } from 'nanoid'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { Sidebar, Table, TableNode } from '.'

const initialNodes: TableNode[] = [
  {
    id: '1',
    position: { x: 500, y: 400 },
    data: {
      label: 'Node 1',
      fields: [
        {
          id: nanoid(),
          label: 'id',
          type: FieldType.INT,
          isRequired: true,
        },
        {
          id: nanoid(),
          label: 'name',
          type: FieldType.VARCHAR,
          isRequired: true,
        },
        {
          id: nanoid(),
          label: 'created_at',
          type: FieldType.DATETIME,
          isRequired: false,
        },
      ],
    },
    draggable: true,
    type: 'table',
  },
  {
    id: '12',
    position: { x: 300, y: 400 },
    data: { label: 'Node 2', fields: [] },
    draggable: true,
    type: 'table',
  },
]

const nodeTypes: NodeTypes = { table: Table }
const defaultEdgeOptions: Partial<Edge> = {
  animated: false,
  reconnectable: true,
  deletable: true,
}

export function Canvas() {
  const [isMounted, setIsMounted] = useState(false)

  const [nodes, setNodes] = useLocalStorage<TableNode[]>(
    'nodes',
    initialNodes,
  )
  const [edges, setEdges] = useLocalStorage<Edge[]>('edges', [])
  const edgeReconnectSuccessful = useRef(true)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const sortedNodes = useMemo<TableNode[]>(
    () =>
      nodes
        .map(node => ({
          ...node,
          data: {
            ...node.data,
            fields: node.data.fields
              ? node.data.fields.sort((a, b) => a.label.localeCompare(b.label))
              : [],
          },
        }))
        .sort((a, b) => a.data.label.localeCompare(b.data.label)),
    [nodes],
  )

  // --- Event Handlers ---
  const onNodesChange: OnNodesChange<TableNode> = useCallback(
    changes => setNodes(nds => applyNodeChanges(changes, nds)),
    [setNodes],
  )

  const onConnect: OnConnect = useCallback(
    connection => {
      const isValid = connection.source !== connection.target // node cannot connect to itself
      isValid && setEdges(eds => addEdge(connection, eds))
    },
    [setEdges],
  )

  const onReconnectStart: ReactFlowProps['onReconnectStart'] =
    useCallback(() => {
      edgeReconnectSuccessful.current = false
    }, [])

  const onReconnect: OnReconnect = useCallback((oldEdge, newConnection) => {
    edgeReconnectSuccessful.current = true
    const isValid = newConnection.source !== newConnection.target // node cannot reconnect to itself
    isValid && setEdges(els => reconnectEdge(oldEdge, newConnection, els))
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

  if (!isMounted) return null

  return (
    <main className='grid grid-cols-[9fr_31fr] h-full'>
      <Sidebar nodes={sortedNodes} setNodes={setNodes} />
      <ReactFlow
        className='h-full w-full text-white !bg-zinc-950'
        colorMode='dark'
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        defaultEdgeOptions={defaultEdgeOptions}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
      />
    </main>
  )
}
