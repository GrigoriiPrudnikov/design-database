export interface Field {
  label: string
  type: FieldType
  isRequired: boolean
  param?: number
}

export enum FieldType {
  INT = 'INT',
  SMALLINT = 'SMALLINT',
  BIGINT = 'BIGINT',
  FLOAT = 'FLOAT',
  DOUBLE = 'DOUBLE',
  CHAR = 'CHAR',
  VARCHAR = 'VARCHAR',
  TEXT = 'TEXT',
  NCHAR = 'NCHAR',
  NVARCHAR = 'NVARCHAR',
  CLOB = 'CLOB',
  DATE = 'DATE',
  TIME = 'TIME',
  DATETIME = 'DATETIME',
  TIMESTAMP = 'TIMESTAMP',
  YEAR = 'YEAR',
  BOOLEAN = 'BOOLEAN',
  BINARY = 'BINARY',
  VARBINARY = 'VARBINARY',
  BLOB = 'BLOB',
  JSON = 'JSON',
  UUID = 'UUID',
  XML = 'XML',
  // add decimal data type
}
