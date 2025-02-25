import { Table } from '@/components'
import { Column, Datatype, Relation } from '@/types'

interface Params {
  tables: Table[]
  columns: Column[]
  relations: Relation[]
}

// Only for Postgresql at the moment
export function createQuery({ tables, columns, relations }: Params): string {
  let query: string[] = []

  tables.forEach(table => {
    query.push(`CREATE TABLE ${table.data.label} (`)

    columns
      .filter(c => c.tableId === table.id)
      .forEach(column => {
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

        let line = `  ${label} ${datatype.toUpperCase()}${limit && `(${limit})`}`

        if (isPrimaryKey) {
          line += ' PRIMARY KEY'
          query.push(line)
          return
        }

        if (isRequired) line += ' NOT NULL'
        if (isUnique) line += ' UNIQUE'
        if (defaultValue !== '') line += ` DEFAULT ${getDefaultValue(column)}`

        query.push(line)
      })

    query.push(');')
  })

  return query.join('\n')
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
