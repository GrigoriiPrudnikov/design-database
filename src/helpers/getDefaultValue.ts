import { Column, Datatype } from '@/types'

export function getDefaultValue(column: Column): string {
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
