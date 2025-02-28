import { Table } from '@/components'
import { reservedNames } from '@/constants'
import { Column, Datatype, Relation } from '@/types'

interface Params {
  tables: Table[]
  columns: Column[]
  relations: Relation[]
}

interface CreateQueryResult {
  query: string
  error: string | null
}

// Only for Postgresql at the moment
export function createQuery({
  tables,
  columns,
  relations,
}: Params): CreateQueryResult {
  let query: string[] = []
  let error: string | null = null

  // Tables
  tables.forEach(table => {
    const { label } = table.data
    const tableName = isReservedName(label) ? `"${label}"` : label

    query.push(`CREATE TABLE ${tableName} (`)

    columns
      .filter(c => c.tableId === table.id)
      .forEach((column, idx, arr) => {
        if (error) return

        const {
          label,
          datatype,
          isPrimaryKey,
          isRequired,
          isUnique,
          isArray,
          limit,
          defaultValue,
        } = column

        const columnName = isReservedName(label) ? `"${label}"` : label

        if (
          (datatype === Datatype.Char || datatype === Datatype.Bit) &&
          !limit
        ) {
          error = `Column ${label} has datatype ${datatype}, but no limit`
          return
        }

        let line = `  ${columnName} ${datatype}${limit ? `(${limit})` : ''}${isArray ? '[]' : ''}`

        if (isPrimaryKey) {
          line += ' PRIMARY KEY,'
          query.push(line)
          return
        }

        if (isRequired) line += ' NOT NULL'
        if (isUnique) line += ' UNIQUE'
        if (defaultValue !== '') line += ` DEFAULT ${getDefaultValue(column)}`

        query.push(`${line}${idx !== arr.length - 1 ? ',' : ''}`)
      })

    if (!error) query.push(');')
  })

  // Relations
  relations.forEach(rel => {
    if (error) return

    const { source, target } = rel
    const sourceColumn = columns.find(c => c.id === source)
    const targetColumn = columns.find(c => c.id === target)

    if (!sourceColumn || !targetColumn) {
      error = `Relation ${source} to ${target} is not valid`
      return
    }

    const sourceColumnName = isReservedName(sourceColumn.label)
      ? `"${sourceColumn.label}"`
      : sourceColumn.label
    const targetColumnName = isReservedName(targetColumn.label)
      ? `"${targetColumn.label}"`
      : targetColumn.label

    const sourceTable = tables.find(t => t.id === sourceColumn.tableId)
    const targetTable = tables.find(t => t.id === targetColumn.tableId)

    if (!sourceTable || !targetTable) {
      error = `Relation ${sourceColumn.label} to ${targetColumn.label} is not valid`
      return
    }

    const sourceTableName = isReservedName(sourceTable.data.label)
      ? `"${sourceTable.data.label}"`
      : sourceTable.data.label
    const targetTableName = isReservedName(targetTable.data.label)
      ? `"${targetTable.data.label}"`
      : targetTable.data.label

    query.push(
      `ALTER TABLE ${sourceTableName}\nADD FOREIGN KEY (${sourceColumnName})\nREFERENCES ${targetTableName}(${targetColumnName}) ON DELETE CASCADE ON UPDATE CASCADE;`,
    )
  })

  return { query: query.join('\n'), error }
}

function getDefaultValue(column: Column): string {
  const { defaultValue, datatype } = column

  if (!defaultValue) return ''

  if (datatype === Datatype.Bit || datatype === Datatype.Varbit) {
    return "B'" + defaultValue + "'"
  }

  const needParens: Datatype[] = [
    Datatype.Char,
    Datatype.Varchar,
    Datatype.Text,
    Datatype.Json,
    Datatype.Uuid,
  ]
  if (needParens.includes(datatype)) return "'" + defaultValue + "'"

  return defaultValue
}

function isReservedName(name: string) {
  return reservedNames.includes(name)
}
