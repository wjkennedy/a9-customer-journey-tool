import type { CustomerJourney } from "./types"

const NODE_WIDTH = 200
const NODE_HEIGHT = 80
const HORIZONTAL_GAP = 250
const VERTICAL_STEP = NODE_HEIGHT * 0.7 // 70% of node height as vertical separator

interface LayoutNode {
  id: string
  depth: number
  verticalIndex: number
  children: string[]
}

/**
 * Auto-layout algorithm that stair-steps nodes
 * - Nodes flow left to right based on edge connections
 * - Each child is placed below and to the right of its parent
 * - 70% node height as vertical separator padding
 */
export function calculateAutoLayout(journey: CustomerJourney): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>()

  if (journey.nodes.length === 0) return positions

  // Build adjacency list and find root nodes (no incoming edges)
  const outgoingEdges = new Map<string, string[]>()
  const incomingCount = new Map<string, number>()

  journey.nodes.forEach((node) => {
    outgoingEdges.set(node.id, [])
    incomingCount.set(node.id, 0)
  })

  journey.edges.forEach((edge) => {
    const children = outgoingEdges.get(edge.source) || []
    children.push(edge.target)
    outgoingEdges.set(edge.source, children)
    incomingCount.set(edge.target, (incomingCount.get(edge.target) || 0) + 1)
  })

  // Find root nodes (nodes with no incoming edges)
  const rootNodes = journey.nodes.filter((node) => (incomingCount.get(node.id) || 0) === 0)

  // If no root nodes found (circular graph), start with first node
  if (rootNodes.length === 0 && journey.nodes.length > 0) {
    rootNodes.push(journey.nodes[0])
  }

  // BFS to assign depths
  const depths = new Map<string, number>()
  const visited = new Set<string>()
  const queue: { id: string; depth: number }[] = rootNodes.map((n) => ({ id: n.id, depth: 0 }))

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!

    if (visited.has(id)) continue
    visited.add(id)
    depths.set(id, depth)

    const children = outgoingEdges.get(id) || []
    children.forEach((childId) => {
      if (!visited.has(childId)) {
        queue.push({ id: childId, depth: depth + 1 })
      }
    })
  }

  // Handle disconnected nodes
  journey.nodes.forEach((node) => {
    if (!depths.has(node.id)) {
      depths.set(node.id, 0)
    }
  })

  // Group nodes by depth
  const nodesByDepth = new Map<number, string[]>()
  depths.forEach((depth, id) => {
    const nodes = nodesByDepth.get(depth) || []
    nodes.push(id)
    nodesByDepth.set(depth, nodes)
  })

  // Track vertical positions at each depth for stair-stepping
  const verticalOffsetByDepth = new Map<number, number>()

  // Position nodes with stair-step layout
  const sortedDepths = Array.from(nodesByDepth.keys()).sort((a, b) => a - b)

  sortedDepths.forEach((depth) => {
    const nodesAtDepth = nodesByDepth.get(depth) || []

    nodesAtDepth.forEach((nodeId, index) => {
      // Get parent's vertical position for stair-stepping
      let baseY = 100

      // Find parent node to stair-step from
      const parentEdge = journey.edges.find((e) => e.target === nodeId)
      if (parentEdge && positions.has(parentEdge.source)) {
        const parentPos = positions.get(parentEdge.source)!
        // Count siblings (other children of the same parent)
        const siblings = journey.edges.filter((e) => e.source === parentEdge.source)
        const siblingIndex = siblings.findIndex((e) => e.target === nodeId)
        baseY = parentPos.y + siblingIndex * VERTICAL_STEP
      } else {
        // For root nodes or disconnected nodes, stack them vertically
        const currentOffset = verticalOffsetByDepth.get(depth) || 0
        baseY = 100 + currentOffset
        verticalOffsetByDepth.set(depth, currentOffset + VERTICAL_STEP)
      }

      positions.set(nodeId, {
        x: 100 + depth * HORIZONTAL_GAP,
        y: baseY,
      })
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
        y: lastNode.position.y + outgoingCount * VERTICAL_STEP,
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
    y: maxY + VERTICAL_STEP,
  }
}
