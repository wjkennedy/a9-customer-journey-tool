"use client"

import React from "react"
import { useJourneyStore } from "@/lib/journey-store"
import { NODE_COLORS } from "@/components/journey-node"

// Isometric projection using standard 30-degree angles
const projectIsometric = (x: number, y: number, z: number) => {
  const angle = Math.PI / 6 // 30 degrees
  const sx = x - z * Math.cos(angle)
  const sy = y + z * Math.sin(angle)
  return { sx, sy }
}

// Calculate node hierarchy and positions based on edges
const calculateNodePositions = (nodes: any[], edges: any[]) => {
  const positions: Record<string, { x: number; y: number; depth: number }> = {}
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  const visited = new Set<string>()
  const depthMap = new Map<string, number>()

  // Find root nodes (no incoming edges)
  const incomingEdges = new Map<string, number>()
  edges.forEach((e) => {
    incomingEdges.set(e.target, (incomingEdges.get(e.target) || 0) + 1)
  })

  const roots = nodes.filter((n) => !incomingEdges.has(n.id))

  // BFS to calculate depths
  const queue = [...roots]
  let currentDepth = 0

  while (queue.length > 0) {
    const nextQueue: typeof nodes = []
    const depthQueue: Record<string, number[]> = {}

    for (const node of queue) {
      depthMap.set(node.id, currentDepth)
      const outgoing = edges.filter((e) => e.source === node.id)
      outgoing.forEach((e) => {
        const target = nodeMap.get(e.target)
        if (target && !depthMap.has(target.id)) {
          nextQueue.push(target)
        }
      })
    }

    queue.length = 0
    queue.push(...nextQueue)
    currentDepth++
  }

  // Position nodes based on depth
  nodes.forEach((node) => {
    const depth = depthMap.get(node.id) || 0
    const nodesAtDepth = nodes.filter((n) => depthMap.get(n.id) === depth).length
    const indexAtDepth = nodes.filter((n) => depthMap.get(n.id) === depth && nodes.indexOf(n) <= nodes.indexOf(node)).length - 1

    positions[node.id] = {
      x: 120 + depth * 220,
      y: 100 + indexAtDepth * 180,
      depth,
    }
  })

  return positions
}

export function IsometricView() {
  const { currentJourney } = useJourneyStore()

  if (!currentJourney || currentJourney.nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        No nodes to display
      </div>
    )
  }

  const boxWidth = 70
  const boxHeight = 70
  const boxDepth = 70
  const nodePositions = calculateNodePositions(currentJourney.nodes, currentJourney.edges)

  // Generate isometric cube faces
  const generateCube = (x: number, y: number, z: number, color: string) => {
    // 8 corners of the cube
    const corners = [
      projectIsometric(x, y, z),
      projectIsometric(x + boxWidth, y, z),
      projectIsometric(x + boxWidth, y + boxHeight, z),
      projectIsometric(x, y + boxHeight, z),
      projectIsometric(x, y, z + boxDepth),
      projectIsometric(x + boxWidth, y, z + boxDepth),
      projectIsometric(x + boxWidth, y + boxHeight, z + boxDepth),
      projectIsometric(x, y + boxHeight, z + boxDepth),
    ]

    const [c0, c1, c2, c3, c4, c5, c6, c7] = corners

    return {
      // Top face (z + depth)
      top: `${c4.sx},${c4.sy} ${c5.sx},${c5.sy} ${c6.sx},${c6.sy} ${c7.sx},${c7.sy}`,
      topFill: color,
      topOpacity: 0.95,

      // Left face (x = 0)
      left: `${c0.sx},${c0.sy} ${c4.sx},${c4.sy} ${c7.sx},${c7.sy} ${c3.sx},${c3.sy}`,
      leftFill: color,
      leftOpacity: 0.7,

      // Right face (x + width)
      right: `${c1.sx},${c1.sy} ${c5.sx},${c5.sy} ${c6.sx},${c6.sy} ${c2.sx},${c2.sy}`,
      rightFill: color,
      rightOpacity: 0.85,

      centerX: (c0.sx + c1.sx + c2.sx + c3.sx) / 4,
      centerY: (c0.sy + c1.sy + c2.sy + c3.sy) / 4,
    }
  }

  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1400 900"
      style={{
        backgroundColor: "#1a1a2e",
      }}
    >
      <defs>
        <linearGradient id="isoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f3460" />
          <stop offset="100%" stopColor="#0a1f2e" />
        </linearGradient>
      </defs>

      <rect width="1400" height="900" fill="url(#isoBg)" />

      {/* Render connection lines first (behind nodes) */}
      {currentJourney.edges.map((edge) => {
        const sourceNode = currentJourney.nodes.find((n) => n.id === edge.source)
        const targetNode = currentJourney.nodes.find((n) => n.id === edge.target)

        if (!sourceNode || !targetNode) return null

        const sourcePosData = nodePositions[sourceNode.id]
        const targetPosData = nodePositions[targetNode.id]

        if (!sourcePosData || !targetPosData) return null

        const sourceProj = projectIsometric(sourcePosData.x + 35, sourcePosData.y + 35, 35 + boxDepth)
        const targetProj = projectIsometric(targetPosData.x + 35, targetPosData.y + 35, 35 + boxDepth)

        return (
          <g key={`edge-${edge.id}`}>
            {/* Connection line */}
            <line
              x1={sourceProj.sx}
              y1={sourceProj.sy}
              x2={targetProj.sx}
              y2={targetProj.sy}
              stroke="rgba(148, 163, 184, 0.4)"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              strokeDasharray="4,4"
            />
            {/* Edge label if exists */}
            {edge.label && (
              <text
                x={(sourceProj.sx + targetProj.sx) / 2}
                y={(sourceProj.sy + targetProj.sy) / 2 - 5}
                fontSize="10"
                fill="rgba(148, 163, 184, 0.8)"
                textAnchor="middle"
                pointerEvents="none"
              >
                {edge.label}
              </text>
            )}
          </g>
        )
      })}

      {/* Render nodes as isometric cubes */}
      {currentJourney.nodes.map((node) => {
        const color = NODE_COLORS[node.type] || "#6366f1"
        const posData = nodePositions[node.id]

        if (!posData) return null

        const x = posData.x
        const y = posData.y
        const z = 15

        const cube = generateCube(x, y, z, color)

        return (
          <g key={node.id}>
            {/* Top face */}
            <polygon
              points={cube.top}
              fill={cube.topFill}
              opacity={cube.topOpacity}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />

            {/* Left face */}
            <polygon
              points={cube.left}
              fill={cube.leftFill}
              opacity={cube.leftOpacity}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="1"
            />

            {/* Right face */}
            <polygon
              points={cube.right}
              fill={cube.rightFill}
              opacity={cube.rightOpacity}
              stroke="rgba(0,0,0,0.15)"
              strokeWidth="1"
            />

            {/* Label - split into lines if too long */}
            {node.label && (
              <g>
                <text
                  x={cube.centerX}
                  y={cube.centerY - 5}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill="white"
                  pointerEvents="none"
                  className="select-none"
                >
                  {node.label.length > 16 ? node.label.substring(0, 14) + "..." : node.label}
                </text>
                {/* Node type indicator */}
                <circle
                  cx={cube.centerX}
                  cy={cube.centerY + 10}
                  r="2.5"
                  fill="rgba(255,255,255,0.7)"
                />
              </g>
            )}
          </g>
        )
      })}

      {/* Arrow marker */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="rgba(148, 163, 184, 0.6)" />
        </marker>
      </defs>

      {/* Info and Legend */}
      <text x="20" y="30" fontSize="16" fontWeight="bold" fill="white">
        Isometric Journey View
      </text>
      <text x="20" y="52" fontSize="12" fill="rgba(255,255,255,0.7)">
        {currentJourney.nodes.length} nodes • {currentJourney.edges.length} connections
      </text>

      {/* Node type legend */}
      <g>
        <text x="20" y="75" fontSize="11" fontWeight="bold" fill="rgba(255,255,255,0.8)">
          Node Types:
        </text>
        {Object.entries(NODE_COLORS).map((entry, idx) => (
          <g key={entry[0]}>
            <circle cx={20 + idx * 110} cy="95" r="4" fill={entry[1]} opacity="0.85" />
            <text x={30 + idx * 110} y="99" fontSize="10" fill="rgba(255,255,255,0.7)" className="capitalize">
              {entry[0]}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}
