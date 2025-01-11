import { TableNode } from '@/components'

type Point = { x: number; y: number }

export function calcNodePosition(nds: TableNode[]): Point {
  if (nds.length === 0) {
    return { x: 0, y: 0 }
  }

  if (nds.length === 1) {
    return { x: nds[0].position.x + 100, y: nds[0].position.y + 100 }
  }

  const existing: Point[] = nds.map(n => ({
    x: n.position.x,
    y: n.position.y,
  }))

  const centroidX = existing.reduce((sum, a) => sum + a.x, 0) / existing.length
  const centroidY = existing.reduce((sum, a) => sum + a.y, 0) / existing.length
  const centroid: Point = { x: centroidX, y: centroidY }

  return centroid
}
