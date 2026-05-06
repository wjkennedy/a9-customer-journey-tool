"use client"

import React from "react"
import { useJourneyStore } from "@/lib/journey-store"
import { NODE_COLORS } from "@/components/journey-node"

export function IsometricView() {
  const { currentJourney } = useJourneyStore()

  if (!currentJourney || currentJourney.nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        No nodes to display
      </div>
    )
  }

  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1200 800"
      style={{
        filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.3))",
      }}
    >
      {/* Background */}
      <defs>
        <linearGradient id="isoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0f3460" />
        </linearGradient>
        <filter id="isoShadow">
          <feDropShadow dx="4" dy="6" stdDeviation="3" floodOpacity="0.4" />
        </filter>
      </defs>

      <rect width="1200" height="800" fill="url(#isoBg)" />

      {/* Render nodes in isometric projection */}
      {currentJourney.nodes.map((node, index) => {
        const nodeColor = NODE_COLORS[node.type] || "#6366f1"
        const x = 150 + index * 180
        const y = 300 + Math.sin(index) * 100
        const size = 80

        // Isometric transform calculations
        const isoX = x - (y * Math.cos(Math.PI / 6)) / 2
        const isoY = y / 2 + (size / 2)

        return (
          <g key={node.id} filter="url(#isoShadow)">
            {/* 3D Box effect with isometric perspective */}
            {/* Top face */}
            <polygon
              points={`${isoX},${isoY - size} ${isoX + size},${isoY - size + size * 0.3} ${isoX + size},${isoY + size * 0.3} ${isoX},${isoY}`}
              fill={nodeColor}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
              opacity="0.9"
            />

            {/* Left face */}
            <polygon
              points={`${isoX},${isoY} ${isoX},${isoY + size * 0.5} ${isoX + size * 0.4},${isoY + size * 0.7} ${isoX + size},${isoY + size * 0.2}`}
              fill={nodeColor}
              opacity="0.7"
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
            />

            {/* Right face */}
            <polygon
              points={`${isoX + size},${isoY - size + size * 0.3} ${isoX + size},${isoY + size * 0.2} ${isoX + size * 1.4},${isoY + size * 0.5} ${isoX + size * 1.4},${isoY - size + size * 0.6}`}
              fill={nodeColor}
              opacity="0.5"
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="1"
            />

            {/* Label */}
            <text
              x={isoX + size / 2}
              y={isoY - size / 3}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
              pointerEvents="none"
            >
              {node.label ? node.label.substring(0, 10) : "Node"}
            </text>

            {/* Node type icon indicator */}
            <circle
              cx={isoX + size / 2}
              cy={isoY + size / 4}
              r="4"
              fill="rgba(255,255,255,0.6)"
            />
          </g>
        )
      })}

      {/* Render edges as isometric lines */}
      {currentJourney.edges.map((edge) => {
        const sourceNode = currentJourney.nodes.find((n) => n.id === edge.source)
        const targetNode = currentJourney.nodes.find((n) => n.id === edge.target)

        if (!sourceNode || !targetNode) return null

        const sourceIndex = currentJourney.nodes.indexOf(sourceNode)
        const targetIndex = currentJourney.nodes.indexOf(targetNode)

        const sourceX = 150 + sourceIndex * 180
        const sourceY = 300 + Math.sin(sourceIndex) * 100
        const targetX = 150 + targetIndex * 180
        const targetY = 300 + Math.sin(targetIndex) * 100
        const size = 80

        const isoSourceX = sourceX - (sourceY * Math.cos(Math.PI / 6)) / 2 + size
        const isoSourceY = sourceY / 2 + size / 2
        const isoTargetX = targetX - (targetY * Math.cos(Math.PI / 6)) / 2
        const isoTargetY = targetY / 2 - size / 2

        return (
          <line
            key={edge.id}
            x1={isoSourceX}
            y1={isoSourceY}
            x2={isoTargetX}
            y2={isoTargetY}
            stroke="rgba(100,200,255,0.5)"
            strokeWidth="2"
            strokeDasharray="5,5"
            markerEnd="url(#arrowhead)"
          />
        )
      })}

      {/* Arrow marker */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="rgba(100,200,255,0.5)" />
        </marker>
      </defs>

      {/* Legend */}
      <text x="20" y="30" fontSize="14" fontWeight="bold" fill="white">
        Isometric View - {currentJourney.nodes.length} nodes
      </text>
    </svg>
  )
}
