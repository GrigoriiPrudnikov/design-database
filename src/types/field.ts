export interface Field {
  id: string
  label: string
  type: FieldType
  isRequired: boolean
  param?: number
}

export enum FieldType {
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
