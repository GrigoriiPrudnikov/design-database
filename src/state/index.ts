import { TableNode } from '@/components'
import { calcNodePosition, toSnakeCase } from '@/helpers'
import { Field, FieldType, Relation } from '@/types'
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
  createField: (node: TableNode) => (label: string) => void
  updateField: (node: TableNode, id: string, changes: Partial<Field>) => void
  removeField: (node: TableNode, id: string) => void
  changeRelationType: (id: string, toChange: 'target' | 'source') => void
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

        const foundRel = get().relations.find(
          rel => rel.target === oldEdge.targetHandle?.split('__')[0],
        )
        if (!foundRel) return

        console.log('old target:' + oldEdge.targetHandle?.split('__')[0])
        console.log('new target:' + newConnection.targetHandle?.split('__')[0])

        set({
          edgeReconnectSuccessful: true,
          edges: reconnectEdge(oldEdge, newConnection, get().edges),
          relations: get().relations.map(rel => {
            if (rel.id !== foundRel.id) return rel
            return {
              ...rel,
              target: newConnection.targetHandle?.split('__')[0]!,
            }
          })!,
        })
      },
      onReconnectStart: () => set({ edgeReconnectSuccessful: false }),
      onReconnectEnd: (_, edge) => {
        if (!get().edgeReconnectSuccessful) {
          set({ edges: get().edges.filter(e => e.id !== edge.id) })
        }

        set({ edgeReconnectSuccessful: false })
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
            fields: [],
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
      createField: node => {
        return label => {
          const found = node.data.fields.find(
            f => f.label === toSnakeCase(label),
          )
          if (found) return

          const updates: TableNode = {
            ...node,
            data: {
              ...node.data,
              fields: [
                ...node.data.fields,
                {
                  label: toSnakeCase(label),
                  id: nanoid(),
                  type: FieldType.INT,
                  isRequired: true,
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
      updateField: (node, id, changes) => {
        const updates = {
          ...node,
          data: {
            ...node.data,
            fields: node.data.fields.map(f => {
              if (f.id !== id) return f

              return {
                ...f,
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
      removeField: (node, id) => {
        const updates = {
          ...node,
          data: {
            ...node.data,
            fields: node.data.fields.filter(f => f.id !== id),
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
    }),
    {
      name: 'state',
    },
  ),
)
