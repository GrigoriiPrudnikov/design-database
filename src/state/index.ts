import { Table } from '@/components'
import { calcNodePosition, isCompatibleDatatype, toSnakeCase } from '@/helpers'
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
import { toast } from 'sonner'
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
  setPrimaryKey: (columnId: string) => void
}

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      tables: [
        {
          id: '0',
          data: {
            label: 'user',
          },
          type: 'table',
          position: { x: 0, y: 0 },
        },
      ],
      columns: [
        {
          id: '0',
          label: 'id',
          datatype: Datatype.Serial,
          isPrimaryKey: true,
          isRequired: true,
          isUnique: true,
          isArray: false,
          limit: '',
          defaultValue: '',
          tableId: '0',
        },
        {
          id: '1',
          label: 'name',
          datatype: Datatype.Varchar,
          isPrimaryKey: false,
          isRequired: true,
          isUnique: false,
          isArray: false,
          limit: '',
          defaultValue: '',
          tableId: '0',
        },
        {
          id: '2',
          label: 'email',
          datatype: Datatype.Varchar,
          isPrimaryKey: false,
          isRequired: true,
          isUnique: false,
          isArray: false,
          limit: '',
          defaultValue: '',
          tableId: '0',
        },
      ],
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

        if (!sourceHandle || !targetHandle) return

        const sourceColumnId = sourceHandle.split('__')[0]
        const targetColumnId = targetHandle.split('__')[0]

        if (sourceColumnId === targetColumnId) {
          return toast.error('Cannot connect columns to themselves')
        }

        const sourceColumn = get().columns.find(c => c.id === sourceColumnId)
        const targetColumn = get().columns.find(c => c.id === targetColumnId)

        if (!sourceColumn || !targetColumn) {
          return toast.error('Source or target column does not exist')
        }

        const isValidDataTypes = isCompatibleDatatype(
          sourceColumn.datatype,
          targetColumn.datatype,
        )

        if (!isValidDataTypes) {
          toast.error('Cannot connect columns with incompatible datatypes')
          return
        }

        const edges = addEdge(connection, get().edges)
        const relation: Relation = {
          id: nanoid(),
          source: sourceHandle.split('__')[0],
          target: targetHandle.split('__')[0],
        }

        set({ edges, relations: [...get().relations, relation] })
      },
      onReconnect: (oldEdge, newConnection) => {
        const { sourceHandle, targetHandle } = newConnection

        const foundRelation = get().relations.find(
          rel => rel.target === oldEdge.targetHandle?.split('__')[0],
        )
        if (!foundRelation) return

        if (!sourceHandle || !targetHandle) return

        const sourceColumnId = sourceHandle.split('__')[0]
        const targetColumnId = targetHandle.split('__')[0]

        if (sourceColumnId === targetColumnId) {
          return toast.error('Cannot connect columns to themselves')
        }

        const sourceColumn = get().columns.find(c => c.id === sourceColumnId)
        const targetColumn = get().columns.find(c => c.id === targetColumnId)

        if (!sourceColumn || !targetColumn) {
          return toast.error('Source or target column does not exist')
        }

        const isValidDataTypes = isCompatibleDatatype(
          sourceColumn.datatype,
          targetColumn.datatype,
        )

        if (!isValidDataTypes) {
          set({ edgeReconnectSuccessful: true })
          return toast.error(
            'Cannot connect columns with incompatible datatypes',
          )
        }

        set({
          edgeReconnectSuccessful: true,
          edges: reconnectEdge(oldEdge, newConnection, get().edges),
          relations: get().relations.map(rel => {
            const target = newConnection.targetHandle?.split('__')[0]
            if (rel.id !== foundRelation.id || !target) return rel

            return {
              ...rel,
              target,
            }
          }),
        })
      },
      onReconnectStart: () => set({ edgeReconnectSuccessful: false }),
      onReconnectEnd: (_, edge) => {
        if (!get().edgeReconnectSuccessful) {
          set({
            edges: get().edges.filter(e => e.id !== edge.id),
            relations: get().relations.filter(
              rel => rel.target !== edge.targetHandle?.split('__')[0],
            ),
          })
        }

        set({ edgeReconnectSuccessful: false })
      },
      createTable: label => {
        const tables = get().tables
        const found = tables.find(r => r.data.label === toSnakeCase(label))
        if (found) return toast.error('Table with this name already exists')

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
          columns: get().columns.filter(c => c.tableId !== id),
          relations: get().relations.filter(
            r => r.target !== id && r.source !== id,
          ),
        })
      },
      createColumn: tableId => {
        return label => {
          const found = get().columns.find(c => c.label === toSnakeCase(label))
          if (found) return toast.error('Column with this name already exists')

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
