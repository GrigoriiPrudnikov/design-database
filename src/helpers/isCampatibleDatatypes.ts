import { Datatype } from '@/types'

export function isCompatibleDatatype(dt1: Datatype, dt2: Datatype): boolean {
  if (dt1 === dt2) return true

  const compatiblePairs: [Datatype, Datatype][] = [
    [Datatype.Int, Datatype.Serial],
    [Datatype.Serial, Datatype.Int],
    [Datatype.BigInt, Datatype.BigSerial],
    [Datatype.BigSerial, Datatype.BigInt],
    [Datatype.SmallInt, Datatype.SmallSerial],
    [Datatype.SmallSerial, Datatype.SmallInt],
  ]

  return compatiblePairs.some(pair => pair[0] === dt1 && pair[1] === dt2)
}
