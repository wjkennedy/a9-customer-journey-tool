"use client"

import React from "react"
import { useJourneyStore } from "@/lib/journey-store"
import { NODE_COLORS } from "@/components/journey-node"

// Isometric projection helper functions
const isoProject = (x: number, y: number, z: number) => {
  const angle = Math.PI / 6 // 30 degrees
  const isoX = x - z * Math.cos(angle)
  const isoY = y + z * Math.sin(angle)
  return { isoX, isoY }
}

const drawIsometricCube = (x: number, y: number, z: number, size: number, color: string) => {
  // Top-left corner
  const { isoX: x1, isoY: y1 } = isoProject(x, y, z + size)
  // Top-right corner
  const { isoX: x2, isoY: y2 } = isoProject(x + size, y, z + size)
  // Bottom-right corner
  const { isoX: x3, isoY: y3 } = isoProject(x + size, y + size, z + size)
  // Bottom-left corner
  const { isoX: x4, isoY: y4 } = isoProject(x, y + size, z + size)
  // Front-top-left
  const { isoX: x5, isoY: y5 } = isoProject(x, y, z)
  // Front-bottom-left
  const { isoX: x6, isoY: y6 } = isoProject(x, y + size, z)

  return {
    top: `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`,
    left: `${x1},${y1} ${x5},${y5} ${x6},${y6} ${x4},${y4}`,
    front: `${x5},${y5} ${x2},${y2} ${x3},${y3} ${x6},${y6}`,
    color,
  }
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

  const cubeSize = 60
  const spacing = 140

  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1400 900"
      style={{
        backgroundColor: "#1a1a2e",
        filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.4))",
      }}
    >
      <defs>
        <linearGradient id="isoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f3460" />
          <stop offset="100%" stopColor="#0a1f2e" />
        </linearGradient>
      </defs>

      <rect width="1400" height="900" fill="url(#isoGradient)" />

      {/* Render nodes as isometric cubes */}
      {currentJourney.nodes.map((node, index) => {
        const nodeColor = NODE_COLORS[node.type] || "#6366f1"
        const x = 100 + (index % 3) * spacing
        const y = 150 + Math.floor(index / 3) * spacing
        const z = Math.sin(index * 0.7) * 30 + 20

        const cube = drawIsometricCube(x, y, z, cubeSize, nodeColor)

        return (
          <g key={node.id}>
            {/* Top face - brightest */}
            <polygon points={cube.top} fill={nodeColor} opacity="0.95" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

            {/* Left face - medium brightness */}
            <polygon
              points={cube.left}
              fill={nodeColor}
              opacity="0.7"
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
            />

            {/* Front face - slightly darker */}
            <polygon
              points={cube.front}
              fill={nodeColor}
              opacity="0.85"
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="1"
            />

            {/* Node label */}
            {index < 6 && (
              <g>
                <text
                  x={x + cubeSize / 2 - 20}
                  y={y + cubeSize / 2 + 5}
                  fontSize="11"
                  fontWeight="bold"
                  fill="white"
                  pointerEvents="none"
                >
                  {node.label ? node.label.substring(0, 12) : "Node"}
                </text>
              </g>
            )}
          </g>
        )
      })}

      {/* Legend and info */}
      <text x="20" y="30" fontSize="16" fontWeight="bold" fill="white">
        Isometric Journey View
      </text>
      <text x="20" y="55" fontSize="12" fill="rgba(255,255,255,0.7)">
        {currentJourney.nodes.length} nodes • {currentJourney.edges.length} connections
      </text>
    </svg>
  )

  if (!currentJourney || currentJourney.nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        No nodes to display
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-auto"
      style={{
        backgroundColor: "#1a1a2e",
      }}
    />
  )
}
