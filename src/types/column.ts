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
  NCHAR = 'nchar',
  NVARCHAR = 'nvarchar',
  CLOB = 'clob',
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime',
  TIMESTAMP = 'timestamp',
  YEAR = 'year',
  BOOLEAN = 'boolean',
  BINARY = 'binary',
  VARBINARY = 'varbinary',
  BLOB = 'blob',
  JSON = 'json',
  UUID = 'uuid',
  XML = 'xml',
  // add decimal data type
}
