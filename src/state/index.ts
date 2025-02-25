import { Table } from '@/components'
import { calcNodePosition, toSnakeCase } from '@/helpers'
import { Column, Datatype, Relation } from '@/types'
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

export interface State {
  tables: Table[]
  columns: Column[]
  edges: Edge[]
  relations: Relation[]
  edgeReconnectSuccessful: boolean
}

export interface Actions {
  onNodesChange: OnNodesChange<Table>
  onConnect: OnConnect
  onReconnect: OnReconnect
  onReconnectStart: ReactFlowProps['onReconnectStart']
  onReconnectEnd: ReactFlowProps['onReconnectEnd']
  createTable: (label: string) => void
  removeTable: (id: string) => void
  createColumn: (tableId: string) => (label: string) => void
  updateColumn: (id: string, changes: Partial<Column>) => void
  removeColumn: (id: string) => void
  changeRelationType: (id: string, toChange: 'target' | 'source') => void
  setPrimaryKey: (columnId: string) => void
}

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      tables: [],
      columns: [],
      edges: [],
      relations: [],
      edgeReconnectSuccessful: true,
      onNodesChange: changes => {
        set({
          tables: applyNodeChanges(changes, get().tables),
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
          }),
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
        const tables = get().tables
        const found = tables.find(r => r.data.label === toSnakeCase(label))
        if (found) return

        const newTable: Table = {
          id: nanoid(),
          type: 'table',
          position: calcNodePosition(tables),
          data: {
            label: toSnakeCase(label),
          },
        }
        const defaultColumn: Column = {
          id: nanoid(),
          label: 'id',
          tableId: newTable.id,
          datatype: Datatype.Serial,
          isPrimaryKey: true,
          isRequired: true,
          isUnique: true,
          isArray: false,
          limit: '',
          defaultValue: '',
        }

        set({
          tables: [...tables, newTable].sort((a, b) =>
            a.data.label.localeCompare(b.data.label),
          ),
          columns: [...get().columns, defaultColumn],
        })
      },
      removeTable: id => {
        set({
          tables: get().tables.filter(t => t.id !== id),
          edges: get().edges.filter(ed => ed.target !== id && ed.source !== id),
        })
      },
      createColumn: tableId => {
        return label => {
          const found = get().columns.find(c => c.label === toSnakeCase(label))
          if (found) return

          const newColumn: Column = {
            id: nanoid(),
            label: toSnakeCase(label),
            tableId,
            datatype: Datatype.Int,
            isRequired: true,
            isUnique: false,
            isPrimaryKey: false,
            isArray: false,
            limit: '',
            defaultValue: '',
          }

          set({ columns: [...get().columns, newColumn] })
        }
      },
      updateColumn: (id, changes) => {
        set({
          columns: get().columns.map(c => {
            if (c.id === id) return { ...c, ...changes }
            return c
          }),
        })
      },
      removeColumn: id => {
        set({ columns: get().columns.filter(c => c.id !== id) })
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
      setPrimaryKey: columnId => {
        const found = get().columns.find(c => c.id === columnId)
        if (!found) return

        set({
          columns: get().columns.map(c => {
            if (c.tableId !== found.tableId) return c

            if (c.id !== columnId)
              return {
                ...c,
                isPrimaryKey: false,
              }

            return {
              ...c,
              isPrimaryKey: true,
              isUnique: true,
              isRequired: true,
              isArray: false,
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
