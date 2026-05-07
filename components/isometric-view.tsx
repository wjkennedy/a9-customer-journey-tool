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
  const spacing = 180

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

      {/* Render nodes as isometric cubes */}
      {currentJourney.nodes.map((node, index) => {
        const color = NODE_COLORS[node.type] || "#6366f1"
        const col = index % 3
        const row = Math.floor(index / 3)
        const x = 150 + col * spacing
        const y = 150 + row * spacing
        const z = Math.sin(index * 0.5) * 25 + 15

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

            {/* Label */}
            <text
              x={cube.centerX}
              y={cube.centerY + 5}
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="white"
              pointerEvents="none"
              className="select-none"
            >
              {node.label ? node.label.substring(0, 10) : "Node"}
            </text>
          </g>
        )
      })}

      {/* Info */}
      <text x="20" y="30" fontSize="16" fontWeight="bold" fill="white">
        Isometric View
      </text>
      <text x="20" y="55" fontSize="12" fill="rgba(255,255,255,0.7)">
        {currentJourney.nodes.length} nodes
      </text>
    </svg>
  )
}
