import { Datatype } from '@/types'
import validator from 'validator'

interface ValidationResult {
  error: string | null
}

type Validations = {
  [key in Datatype]?: ValidationResult
}

const INT_MAX = 2_147_483_648
const SMALLINT_MAX = 32_767
const BIGINT_MAX = Number(9_223_372_036_854_775_807n)

export function validateDefaultValue(
  datatype: Datatype,
): (value: string) => ValidationResult {
  return value => {
    const valid: Validations = {
      [Datatype.Int]: validateInt(value, INT_MAX),
      [Datatype.SmallInt]: validateInt(value, SMALLINT_MAX),
      [Datatype.BigInt]: validateInt(value, BIGINT_MAX),
      [Datatype.Float]: validateFloat(value, 7),
      [Datatype.Double]: validateFloat(value, 15),
      [Datatype.Char]: validateChar(value, 1),
      [Datatype.Varchar]: validateChar(value, 255),
      [Datatype.Text]: { error: null },
      [Datatype.Date]: validateDate(value),
      [Datatype.Time]: validateTime(value),
      [Datatype.Timestamp]: validateTimestamp(value),
      [Datatype.Boolean]: validateBoolean(value),
      [Datatype.Bit]: validateBit(value),
      [Datatype.Varbit]: validateBit(value),
      [Datatype.Json]: validateJson(value),
      [Datatype.Uuid]: validateUUID(value),
    }

    return valid[datatype] || { error: 'Unsupported column type' }
  }
}

function validateInt(value: string, max: number): ValidationResult {
  if (!validator.isInt(value)) {
    return { error: 'Not a valid integer.' }
  }
  if (!validator.isInt(value, { max, min: -max })) {
    return { error: 'Integer exceeds maximum allowed value.' }
  }
  return { error: null }
}

function validateFloat(value: string, maxDecimals: number): ValidationResult {
  if (!validator.isFloat(value)) {
    return { error: 'Not a valid float.' }
  }

  const decimals = value.split('.')[1]
  if (decimals && decimals.length > maxDecimals) {
    return {
      error: `Too many digits after the decimal point; maximum allowed is ${maxDecimals}.`,
    }
  }
  return { error: null }
}

function validateChar(value: string, length: number): ValidationResult {
  if (value.length > length) {
    return {
      error: `Value exceeds maximum allowed length of ${length} characters.`,
    }
  }

  return { error: null }
}

function validateDate(value: string): ValidationResult {
  if (!validator.isDate(value)) {
    return { error: 'Invalid date format YYYY-MM-DD.' }
  }
  return { error: null }
}

function validateTime(value: string): ValidationResult {
  if (!validator.isTime(value, { mode: 'withSeconds' })) {
    return { error: 'Invalid time format HH:MM:SS.' }
  }
  return { error: null }
}

function validateTimestamp(value: string): ValidationResult {
  const [date, time] = value.split(' ')
  if (!date || !validator.isDate(date)) {
    return { error: 'Invalid date format YYYY-MM-DD.' }
  }
  if (!time || !validator.isTime(time, { mode: 'withSeconds' })) {
    return { error: 'Invalid time format HH:MM:SS.' }
  }
  return { error: null }
}

function validateBoolean(value: string): ValidationResult {
  const values = ['TRUE', 'FALSE', '1', '0', 'T', 'F']
  if (!values.includes(value.toUpperCase())) {
    return { error: 'Invalid boolean value.' }
  }
  return { error: null }
}

function validateBit(value: string): ValidationResult {
  for (let i = 0; i < value.length; i++) {
    if (value[i] !== '0' && value[i] !== '1') {
      return { error: 'Invalid bit value.' }
    }
  }
  return { error: null }
}

function validateJson(value: string): ValidationResult {
  if (!validator.isJSON(value)) {
    return { error: 'Invalid JSON format.' }
  }
  return { error: null }
}

function validateUUID(value: string): ValidationResult {
  if (!validator.isUUID(value)) {
    return { error: 'Invalid UUID.' }
  }
  return { error: null }
}
