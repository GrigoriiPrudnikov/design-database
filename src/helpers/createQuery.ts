import { Table } from '@/components'
import { Column, Datatype, Relation } from '@/types'
import { formatName, getDefaultValue } from '.'

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
  tables.forEach((table, idx, arr) => {
    const tableName = formatName(table.data.label)

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

        const columnName = formatName(label)

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

    if (error) return

    query.push(');')

    if (idx !== arr.length - 1) query.push('')
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

    const sourceColumnName = formatName(sourceColumn.label)
    const targetColumnName = formatName(targetColumn.label)

    const sourceTable = tables.find(t => t.id === sourceColumn.tableId)
    const targetTable = tables.find(t => t.id === targetColumn.tableId)

    if (!sourceTable || !targetTable) {
      error = `Relation ${sourceColumn.label} to ${targetColumn.label} is not valid`
      return
    }

    const sourceTableName = formatName(sourceTable.data.label)
    const targetTableName = formatName(targetTable.data.label)

    query.push(
      '',
      `ALTER TABLE ${sourceTableName}`,
      `ADD FOREIGN KEY (${sourceColumnName})`,
      `REFERENCES ${targetTableName}(${targetColumnName}) ON DELETE CASCADE ON UPDATE CASCADE;`,
    )
  })

  return { query: query.join('\n'), error }
}
