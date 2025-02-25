import { Datatype } from '@/types'
import validator from 'validator'

interface ValidationResult {
  valid: boolean
  error?: string
}

type Validations = {
  [key in Datatype]?: ValidationResult
}

const INT_MAX = 2_147_483_648
const SMALLINT_MAX = 32_767
const BIGINT_MAX = Number(9_223_372_036_854_775_807n)

export function validateDefaultValue(
  value: string,
  datatype: Datatype,
): ValidationResult {
  const valid: Validations = {
    [Datatype.Int]: validateInt(value, INT_MAX),
    [Datatype.SmallInt]: validateInt(value, SMALLINT_MAX),
    [Datatype.BigInt]: validateInt(value, BIGINT_MAX),
    [Datatype.Float]: validateFloat(value, 7),
    [Datatype.Double]: validateFloat(value, 15),
    [Datatype.Char]: validateChar(value, 1),
    [Datatype.Varchar]: validateChar(value, 255),
    [Datatype.Text]: { valid: true },
    [Datatype.Date]: validateDate(value),
    [Datatype.Time]: validateTime(value),
    [Datatype.Timestamp]: validateTimestamp(value),
    [Datatype.Boolean]: validateBoolean(value),
    [Datatype.Bit]: validateBit(value),
    [Datatype.Varbit]: validateBit(value),
    [Datatype.Json]: validateJson(value),
    [Datatype.Uuid]: validateUUID(value),
    //[ColumnType.XML]: { valid: false, error: 'Unsupported column type (yet)' },
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

function validateBit(value: string): ValidationResult {
  for (let i = 0; i < value.length; i++) {
    if (value[i] !== '0' && value[i] !== '1')
      return {
        valid: false,
        error: 'Invalid bit value.',
      }
  }
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
