import { ColumnType } from '@/types'
import validator from 'validator'

interface ValidationResult {
  valid: boolean
  error?: string
}

type Validations = {
  [key in ColumnType]?: ValidationResult
}

const INT_MAX = 2_147_483_648
const SMALLINT_MAX = 32_767
const BIGINT_MAX = Number(9_223_372_036_854_775_807n)

export function validateDefaultValue(
  value: string,
  datatype: ColumnType,
): ValidationResult {
  const valid: Validations = {
    [ColumnType.INT]: validateInt(value, INT_MAX),
    [ColumnType.SMALLINT]: validateInt(value, SMALLINT_MAX),
    [ColumnType.BIGINT]: validateInt(value, BIGINT_MAX),
    [ColumnType.FLOAT]: validateFloat(value, 7),
    [ColumnType.DOUBLE]: validateFloat(value, 15),
    [ColumnType.CHAR]: validateChar(value, 1),
    [ColumnType.VARCHAR]: validateChar(value, 255),
    [ColumnType.TEXT]: { valid: true },
    [ColumnType.DATE]: validateDate(value),
    [ColumnType.TIME]: validateTime(value),
    [ColumnType.TIMESTAMP]: validateTimestamp(value),
    [ColumnType.BOOLEAN]: validateBoolean(value),
    [ColumnType.BYTEA]: validateBytea(value),
    [ColumnType.JSON]: validateJson(value),
    [ColumnType.UUID]: validateUUID(value),
    [ColumnType.XML]: { valid: false, error: 'Unsupported column type (yet)' },
  }
  return valid[datatype] || { valid: false, error: 'Unsupported column type' }
}

function validateInt(value: string, max: number): ValidationResult {
  if (!validator.isInt(value)) {
    return {
      valid: false,
      error: 'Not a valid integer.',
    }
  }
  if (!validator.isInt(value, { max, min: -max })) {
    return {
      valid: false,
      error: 'Integer exceeds maximum allowed value.',
    }
  }

  return { valid: true }
}

function validateFloat(value: string, maxDecimals: number): ValidationResult {
  if (!validator.isFloat(value))
    return {
      valid: false,
      error: 'Not a valid float.',
    }

  const decimals = value.split('.')[1]
  if (!decimals || decimals.length > maxDecimals)
    return {
      valid: false,
      error: `Too many digits after the decimal point; maximum allowed is ${maxDecimals}.`,
    }

  return { valid: true }
}

function validateChar(value: string, length: number): ValidationResult {
  if (value.length > length)
    return {
      valid: false,
      error: `Value exceeds maximum allowed length of ${length} characters.`,
    }

  return { valid: true }
}

function validateDate(value: string): ValidationResult {
  if (!validator.isDate(value))
    return {
      valid: false,
      error: 'Invalid date format YYYY-MM-DD.',
    }

  return { valid: true }
}

function validateTime(value: string): ValidationResult {
  if (!validator.isTime(value, { mode: 'withSeconds' }))
    return {
      valid: false,
      error: 'Invalid time format HH:MM:SS.',
    }

  return { valid: true }
}

function validateTimestamp(value: string): ValidationResult {
  const [date, time] = value.split(' ')
  if (!date || !validator.isDate(date))
    return {
      valid: false,
      error: 'Invalid date format YYYY-MM-DD.',
    }

  if (!time || !validator.isTime(time, { mode: 'withSeconds' }))
    return {
      valid: false,
      error: 'Invalid time format HH:MM:SS.',
    }

  return { valid: true }
}

function validateBoolean(value: string): ValidationResult {
  const values = ['TRUE', 'FALSE', '1', '0', 'T', 'F']
  if (!values.includes(value.toUpperCase()))
    return {
      valid: false,
      error: 'Invalid boolean value.',
    }

  return { valid: true }
}

function validateBytea(value: string): ValidationResult {
  if (!validator.isBase64(value))
    return { valid: false, error: 'Invalid base64.' }

  return { valid: true }
}

function validateJson(value: string): ValidationResult {
  if (!validator.isJSON(value))
    return { valid: false, error: 'Invalid JSON format.' }

  return { valid: true }
}

function validateUUID(value: string): ValidationResult {
  if (!validator.isUUID(value)) return { valid: false, error: 'Invalid UUID.' }

  return { valid: true }
}
