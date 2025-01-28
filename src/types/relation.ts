export interface Relation {
  id: string
  source: string
  target: string
  sourceType: 'one' | 'many'
  targetType: 'one' | 'many'
}
