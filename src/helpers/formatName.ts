import { reservedNames } from '@/constants'

export function formatName(name: string) {
  return reservedNames.includes(name) ? `"${name}"` : name
}
