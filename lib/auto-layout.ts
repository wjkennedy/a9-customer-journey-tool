import type { CustomerJourney } from "./types"

export const NODE_WIDTH = 200
export const NODE_HEIGHT = 80
export const HORIZONTAL_GAP = 300 // Increased for less horizontal crowding
export const VERTICAL_GAP = NODE_HEIGHT + NODE_HEIGHT * 0.7 // Full node height + 70% padding

interface LayoutNode {
  id: string
  depth: number
  verticalIndex: number
  parentId?: string
}

/**
 * Auto-layout algorithm that stair-steps nodes
 * - Nodes flow left to right based on edge connections
 * - Each child is placed below and to the right of its parent
 * - 70% node height as vertical separator padding between nodes
 */
export function calculateAutoLayout(journey: CustomerJourney): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>()

  if (journey.nodes.length === 0) return positions

  // Build adjacency list and find root nodes (no incoming edges)
  const outgoingEdges = new Map<string, string[]>()
  const incomingEdges = new Map<string, string[]>()
  const incomingCount = new Map<string, number>()

  journey.nodes.forEach((node) => {
    outgoingEdges.set(node.id, [])
    incomingEdges.set(node.id, [])
    incomingCount.set(node.id, 0)
  })

  journey.edges.forEach((edge) => {
    const children = outgoingEdges.get(edge.source) || []
    children.push(edge.target)
    outgoingEdges.set(edge.source, children)

    const parents = incomingEdges.get(edge.target) || []
    parents.push(edge.source)
    incomingEdges.set(edge.target, parents)

    incomingCount.set(edge.target, (incomingCount.get(edge.target) || 0) + 1)
  })

  // Find root nodes (nodes with no incoming edges)
  const rootNodes = journey.nodes.filter((node) => (incomingCount.get(node.id) || 0) === 0)

  // If no root nodes found (circular graph), start with first node
  if (rootNodes.length === 0 && journey.nodes.length > 0) {
    rootNodes.push(journey.nodes[0])
  }

  // BFS to assign depths and track parent relationships
  const layoutNodes = new Map<string, LayoutNode>()
  const visited = new Set<string>()
  const queue: { id: string; depth: number; parentId?: string }[] = rootNodes.map((n) => ({
    id: n.id,
    depth: 0,
  }))

  while (queue.length > 0) {
    const { id, depth, parentId } = queue.shift()!

    if (visited.has(id)) continue
    visited.add(id)

    layoutNodes.set(id, { id, depth, verticalIndex: 0, parentId })

    const children = outgoingEdges.get(id) || []
    children.forEach((childId) => {
      if (!visited.has(childId)) {
        queue.push({ id: childId, depth: depth + 1, parentId: id })
      }
    })
  }

  // Handle disconnected nodes
  journey.nodes.forEach((node) => {
    if (!layoutNodes.has(node.id)) {
      layoutNodes.set(node.id, { id: node.id, depth: 0, verticalIndex: 0 })
    }
  })

  // Group nodes by depth
  const nodesByDepth = new Map<number, string[]>()
  layoutNodes.forEach((node) => {
    const nodes = nodesByDepth.get(node.depth) || []
    nodes.push(node.id)
    nodesByDepth.set(node.depth, nodes)
  })

  // Process nodes depth by depth, placing children relative to their parents
  const sortedDepths = Array.from(nodesByDepth.keys()).sort((a, b) => a - b)

  // Track the next available Y position globally to prevent overlaps
  let globalNextY = 100

  sortedDepths.forEach((depth) => {
    const nodesAtDepth = nodesByDepth.get(depth) || []

    // Sort nodes at this depth by their parent's Y position for visual coherence
    nodesAtDepth.sort((a, b) => {
      const nodeA = layoutNodes.get(a)!
      const nodeB = layoutNodes.get(b)!

      if (nodeA.parentId && nodeB.parentId) {
        const parentAPos = positions.get(nodeA.parentId)
        const parentBPos = positions.get(nodeB.parentId)
        if (parentAPos && parentBPos) {
          return parentAPos.y - parentBPos.y
        }
      }
      return 0
    })

    nodesAtDepth.forEach((nodeId) => {
      const node = layoutNodes.get(nodeId)!
      let y: number

      if (node.parentId && positions.has(node.parentId)) {
        const parentPos = positions.get(node.parentId)!
        // Calculate Y based on parent + stair-step offset
        const siblings = outgoingEdges.get(node.parentId) || []
        const siblingIndex = siblings.indexOf(nodeId)

        // Start from parent's Y position and add offset for each sibling
        const desiredY = parentPos.y + siblingIndex * VERTICAL_GAP

        // Ensure we don't overlap with previously placed nodes
        y = Math.max(desiredY, globalNextY)
      } else {
        // Root node or disconnected node
        y = globalNextY
      }

      positions.set(nodeId, {
        x: 100 + depth * HORIZONTAL_GAP,
        y: y,
      })

      // Update the global next Y to prevent overlaps
      globalNextY = y + VERTICAL_GAP
    })
  })

  return positions
}

/**
 * Get the optimal position for a new node near the last added/selected node
 */
export function getNewNodePosition(journey: CustomerJourney, lastNodeId?: string): { x: number; y: number } {
  if (journey.nodes.length === 0) {
    return { x: 100, y: 100 }
  }

  // If we have a reference node, place new node to its right and slightly down
  if (lastNodeId) {
    const lastNode = journey.nodes.find((n) => n.id === lastNodeId)
    if (lastNode) {
      // Check how many outgoing edges this node has to offset vertically
      const outgoingCount = journey.edges.filter((e) => e.source === lastNodeId).length
      return {
        x: lastNode.position.x + HORIZONTAL_GAP,
        y: lastNode.position.y + outgoingCount * VERTICAL_GAP,
      }
    }
  }

  // Otherwise, find the rightmost node and place to the right
  let maxX = 0
  let maxY = 100
  journey.nodes.forEach((node) => {
    if (node.position.x > maxX) {
      maxX = node.position.x
      maxY = node.position.y
    }
  })

  return {
    x: maxX + HORIZONTAL_GAP,
    y: maxY + VERTICAL_GAP,
  }
}

/**
 * Calculate the bounding box of all nodes for export
 */
export function getNodesBounds(journey: CustomerJourney): {
  minX: number
  minY: number
  maxX: number
  maxY: number
  width: number
  height: number
} {
  if (journey.nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 800, maxY: 600, width: 800, height: 600 }
  }

  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  journey.nodes.forEach((node) => {
    minX = Math.min(minX, node.position.x)
    minY = Math.min(minY, node.position.y)
    maxX = Math.max(maxX, node.position.x + NODE_WIDTH)
    maxY = Math.max(maxY, node.position.y + NODE_HEIGHT)
  })

  // Add padding
  const padding = 50
  minX -= padding
  minY -= padding
  maxX += padding
  maxY += padding

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  }
}
