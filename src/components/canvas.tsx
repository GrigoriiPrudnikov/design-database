'use client'

import { Actions, State, useStore } from '@/state'
import {
  ConnectionMode,
  Edge,
  MarkerType,
  NodeTypes,
  ReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Sidebar, Table } from '.'

const nodeTypes: NodeTypes = { table: Table }

const defaultEdgeOptions: Partial<Edge> = {
  animated: false,
  reconnectable: true,
  deletable: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
}

function selector(state: State & Actions) {
  return {
    tables: state.tables,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onConnect: state.onConnect,
    onReconnect: state.onReconnect,
    onReconnectStart: state.onReconnectStart,
    onReconnectEnd: state.onReconnectEnd,
  }
}

export function Canvas() {
  const [isMounted, setIsMounted] = useState(false)
  const {
    tables,
    edges,
    onNodesChange,
    onConnect,
    onReconnect,
    onReconnectStart,
    onReconnectEnd,
  } = useStore(useShallow(selector))

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <main className='grid grid-cols-[9fr_31fr] h-full'>
      <Sidebar />
      <ReactFlow
        className='h-full w-full text-white !bg-zinc-950 z-50'
        colorMode='dark'
        nodes={tables}
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
