import { Table } from '@/components'
import { Column, ColumnType, Relation } from '@/types'

interface Params {
  tables: Table[]
  columns: Column[]
  relations: Relation[]
}

export function createQuery({ tables, columns, relations }: Params): string {
  let query: string[] = []

  tables.forEach(table => {
    query.push(`CREATE TABLE ${table.data.label} (`)

    columns
      .filter(c => c.tableId === table.id)
      .forEach(column => {
        let line = `  ${column.label} ${column.datatype.toUpperCase()}`

        if (column.isPrimaryKey) {
          line += ' PRIMARY KEY'
          query.push(line)
          return
        }

        line += ` ${column.isRequired && 'NOT NULL'} ${'DEFAULT ' + getDefaultValue(column)}`
        query.push(line)
      })

    query.push(');')
  })

  return query.join('\n')
}

function getDefaultValue(column: Column): string {
  const { defaultValue, datatype } = column

  if (column.defaultValue === '') {
    return ''
  }

  const defaultValues = {
    [ColumnType.INT]: defaultValue,
    [ColumnType.SMALLINT]: defaultValue,
    [ColumnType.BIGINT]: defaultValue,
    [ColumnType.FLOAT]: defaultValue,
    [ColumnType.DOUBLE]: defaultValue,
    [ColumnType.CHAR]: `'${defaultValue}'`,
    [ColumnType.VARCHAR]: `'${defaultValue}'`,
    [ColumnType.TEXT]: `'${defaultValue}'`,
    [ColumnType.DATE]: defaultValue,
    [ColumnType.TIME]: defaultValue,
    [ColumnType.TIMESTAMP]: `'${defaultValue}'`,
    [ColumnType.BOOLEAN]: defaultValue,
    [ColumnType.BYTEA]: `'${defaultValue}'`,
    [ColumnType.JSON]: `'${defaultValue}'`,
    [ColumnType.UUID]: `'${defaultValue}'`,
    //[ColumnType.XML]: `'${defaultValue}'`,
    //[ColumnType.DECIMAL]: defaultValue,
    [ColumnType.SERIAL]: defaultValue,
    [ColumnType.SMALLSERIAL]: defaultValue,
    [ColumnType.BIGSERIAL]: defaultValue,
  }

  return defaultValues[datatype]
}
