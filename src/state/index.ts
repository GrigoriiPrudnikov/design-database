import { TableNode } from '@/components'
import { calcNodePosition, toSnakeCase } from '@/helpers'
import { Column, ColumnType, Relation } from '@/types'
import {
    addEdge,
    applyNodeChanges,
    Edge,
    OnConnect,
    OnNodesChange,
    OnReconnect,
    ReactFlowProps,
    reconnectEdge,
} from '@xyflow/react'
import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialNodes: TableNode[] = [
  {
    id: '1',
    position: { x: 500, y: 400 },
    data: {
      label: 'Node 1',
      columns: [
        {
          id: nanoid(),
          label: 'id',
          datatype: ColumnType.INT,
          isRequired: true,
          isUnique: true,
          isPrimaryKey: true,
          defaultValue: null,
        },
        {
          id: nanoid(),
          label: 'name',
          datatype: ColumnType.VARCHAR,
          isRequired: true,
          isUnique: true,
          isPrimaryKey: false,
          defaultValue: null,
        },
        {
          id: nanoid(),
          label: 'created_at',
          datatype: ColumnType.DATETIME,
          isRequired: false,
          isUnique: true,
          isPrimaryKey: false,
          defaultValue: null,
        },
      ],
    },
    draggable: true,
    type: 'table',
  },
  {
    id: '12',
    position: { x: 300, y: 400 },
    data: { label: 'Node 2', columns: [] },
    draggable: true,
    type: 'table',
  },
]

export interface State {
  nodes: TableNode[]
  edges: Edge[]
  relations: Relation[]
  edgeReconnectSuccessful: boolean
}

export interface Actions {
  onNodesChange: OnNodesChange<TableNode>
  onConnect: OnConnect
  onReconnect: OnReconnect
  onReconnectStart: ReactFlowProps['onReconnectStart']
  onReconnectEnd: ReactFlowProps['onReconnectEnd']
  createTable: (label: string) => void
  removeTable: (id: string) => void
  createColumn: (node: TableNode) => (label: string) => void
  updateColumn: (node: TableNode, id: string, changes: Partial<Column>) => void
  removeColumn: (node: TableNode, id: string) => void
  changeRelationType: (id: string, toChange: 'target' | 'source') => void
  updatePrimaryKey: (node: TableNode, columnId: string) => void
}

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      nodes: initialNodes,
      edges: [],
      relations: [],
      edgeReconnectSuccessful: true,
      onNodesChange: changes => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        })
      },
      onConnect: connection => {
        const { sourceHandle, targetHandle } = connection

        const isValid =
          sourceHandle?.split('__')[0] !== targetHandle?.split('__')[0]
        if (!isValid) return

        if (!sourceHandle || !targetHandle) return

        const edges = addEdge(connection, get().edges)
        const relation: Relation = {
          id: nanoid(),
          source: sourceHandle.split('__')[0],
          target: targetHandle.split('__')[0],
          sourceType: 'one',
          targetType: 'one',
        }

        set({ edges, relations: [...get().relations, relation] })
      },
      onReconnect: (oldEdge, newConnection) => {
        const { sourceHandle, targetHandle } = newConnection

        const isValid =
          sourceHandle?.split('__')[0] !== targetHandle?.split('__')[0]
        if (!isValid) return

        const foundRelation = get().relations.find(
          rel => rel.target === oldEdge.targetHandle?.split('__')[0],
        )
        if (!foundRelation) return

        set({
          edgeReconnectSuccessful: true,
          edges: reconnectEdge(oldEdge, newConnection, get().edges),
          relations: get().relations.map(rel => {
            if (rel.id !== foundRelation.id) return rel
            return {
              ...rel,
              target: newConnection.targetHandle?.split('__')[0]!,
            }
          })!,
        })
      },
      onReconnectStart: () => set({ edgeReconnectSuccessful: false }),
      onReconnectEnd: (_, edge) => {
        if (get().edgeReconnectSuccessful) {
          set({ edgeReconnectSuccessful: false })
        }

        set({
          edges: get().edges.filter(e => e.id !== edge.id),
          relations: get().relations.filter(
            rel => rel.target !== edge.targetHandle?.split('__')[0],
          ),
        })
      },
      createTable: label => {
        const nodes = get().nodes
        const found = nodes.find(n => n.data.label === toSnakeCase(label))
        if (found) return

        const newNode: TableNode = {
          id: nanoid(),
          type: 'table',
          position: calcNodePosition(nodes),
          data: {
            label: toSnakeCase(label),
            columns: [],
          },
        }

        set({
          nodes: [...nodes, newNode].sort((a, b) =>
            a.data.label.localeCompare(b.data.label),
          ),
        })
      },
      removeTable: id => {
        set({
          nodes: get().nodes.filter(n => n.id !== id),
          edges: get().edges.filter(ed => ed.target !== id && ed.source !== id),
        })
      },
      createColumn: node => {
        return label => {
          const found = node.data.columns.find(
            c => c.label === toSnakeCase(label),
          )
          if (found) return

          const updates: TableNode = {
            ...node,
            data: {
              ...node.data,
              columns: [
                ...node.data.columns,
                {
                  label: toSnakeCase(label),
                  id: nanoid(),
                  datatype: ColumnType.INT,
                  isRequired: true,
                  isUnique: false,
                  isPrimaryKey: false,
                  defaultValue: null,
                },
              ],
            },
          }
          set({
            nodes: [...get().nodes.filter(n => n.id != node.id), updates].sort(
              (a, b) => a.data.label.localeCompare(b.data.label),
            ),
          })
        }
      },
      updateColumn: (node, id, changes) => {
        const updates = {
          ...node,
          data: {
            ...node.data,
            columns: node.data.columns.map(c => {
              if (c.id !== id) return c

              return {
                ...c,
                ...changes,
              }
            }),
          },
        }

        set({
          nodes: get().nodes.map(n => {
            if (n.id === node.id) return updates
            return n
          }),
        })
      },
      removeColumn: (node, id) => {
        const updates = {
          ...node,
          data: {
            ...node.data,
            columns: node.data.columns.filter(c => c.id !== id),
          },
        }
        set({
          nodes: get().nodes.map(n => {
            if (n.id === node.id) return updates
            return n
          }),
        })
      },
      changeRelationType: (id, toChange) => {
        set({
          relations: get().relations.map(rel => {
            if (rel.id !== id) return rel

            const key = toChange === 'target' ? 'targetType' : 'sourceType'
            const value = rel[key] === 'one' ? 'many' : 'one'

            return {
              ...rel,
              [key]: value,
            }
          }),
        })
      },
      updatePrimaryKey: (node, columnId) => {
        set({
          nodes: get().nodes.map(n => {
            if (n.id !== node.id) return n
            return {
              ...n,
              data: {
                ...n.data,
                columns: n.data.columns.map(c => ({
                  ...c,
                  isPrimaryKey: columnId === c.id,
                  isUnique: true,
                  isRequired: true,
                })),
              },
            }
          }),
        })
      },
    }),
    {
      name: 'state',
    },
  ),
)
