import { Table } from '@/components'

type Point = { x: number; y: number }

export function calcNodePosition(nds: Table[]): Point {
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

  // Calculate the centroid (average position) of the existing nodes.
  const centroidX = existing.reduce((sum, p) => sum + p.x, 0) / existing.length
  const centroidY = existing.reduce((sum, p) => sum + p.y, 0) / existing.length
  const centroid: Point = { x: centroidX, y: centroidY }

  // Calculate a dynamic radius.
  // The dynamic radius is the average distance from each node to the centroid.
  // This tells us how "spread out" the nodes are.
  const totalDistance = existing.reduce((sum, p) => {
    const dx = p.x - centroid.x
    const dy = p.y - centroid.y
    return sum + Math.hypot(dx, dy)
  }, 0)
  const dynamicRadius = totalDistance / existing.length || 100 // Fallback default if zero.

  // Prepare to generate candidate positions.
  // We will try several random candidates and choose the best one.
  const numCandidates = 50
  let bestCandidate: Point | null = null
  let bestScore = -Infinity

  // Generate candidate positions within a circle of radius = dynamicRadius.
  for (let i = 0; i < numCandidates; i++) {
    // Random angle between 0 and 2π.
    const angle = Math.random() * 2 * Math.PI
    // Random distance from the centroid (using sqrt to ensure uniform distribution in the circle).
    const r = dynamicRadius * Math.sqrt(Math.random())
    // Calculate candidate position using polar coordinates converted to Cartesian coordinates.
    const candidate: Point = {
      x: centroid.x + r * Math.cos(angle),
      y: centroid.y + r * Math.sin(angle),
    }

    // For this candidate, find the minimum distance to any of the existing nodes.
    let minDistance = Infinity
    for (const p of existing) {
      const dx = candidate.x - p.x
      const dy = candidate.y - p.y
      const distance = Math.hypot(dx, dy)
      if (distance < minDistance) {
        minDistance = distance
      }
    }

    // Update the best candidate if this candidate is farther from its nearest node.
    if (minDistance > bestScore) {
      bestScore = minDistance
      bestCandidate = candidate
    }
  }

  // Return the best candidate found.
  // If for some reason no candidate was found, return the centroid as a fallback.
  return bestCandidate || centroid
}
