export interface Column {
  id: string
  label: string
  datatype: ColumnType
  isRequired: boolean
  isUnique: boolean
  isPrimaryKey: boolean
  defaultValue: string | null
}

export enum ColumnType {
  INT = 'int',
  SMALLINT = 'smallint',
  BIGINT = 'bigint',
  FLOAT = 'float',
  DOUBLE = 'double',
  CHAR = 'char',
  VARCHAR = 'varchar',
  TEXT = 'text',
  DATE = 'date',
  TIME = 'time',
  TIMESTAMP = 'timestamp',
  BOOLEAN = 'boolean',
  BYTEA = 'bytea',
  JSON = 'json',
  UUID = 'uuid',
  XML = 'xml',
  DECIMAL = 'decimal',
}
