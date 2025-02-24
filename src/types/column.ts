import { Datatype } from '.'

export interface Column {
  id: string
  label: string
  tableId: string
  datatype: Datatype
  isRequired: boolean
  isUnique: boolean
  isPrimaryKey: boolean
  isArray: boolean
  limit: string | null // parameter for char, varchar, text, etc
  //limit: number | [number, number] // Supports VARCHAR(255) and DECIMAL(10,2)
  defaultValue: string | null
}
