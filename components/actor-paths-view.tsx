"use client"

import React, { useMemo } from "react"
import { useJourneyStore } from "@/lib/journey-store"
import { NODE_COLORS } from "@/components/journey-node"

const SWIMLANE_HEIGHT = 200
const NODE_WIDTH = 140
const NODE_HEIGHT = 60
const HORIZONTAL_GAP = 80
const VERTICAL_GAP = 40

export function ActorPathsView() {
  const { currentJourney } = useJourneyStore()

  const actorPaths = useMemo(() => {
    if (!currentJourney) return { actors: [], nodesByDepth: {}, handoffs: [] }

    // Get all actors
    const actors = currentJourney.actors
    const unassignedActor = {
      id: "unassigned",
      name: "Unassigned",
      role: "System",
      color: "#666666",
    }
    const allActors = [...actors, unassignedActor]

    // Build adjacency list and find depths via BFS
    const adjList: { [key: string]: string[] } = {}
    const inDegree: { [key: string]: number } = {}

    currentJourney.nodes.forEach((node) => {
      adjList[node.id] = []
      inDegree[node.id] = 0
    })

    currentJourney.edges.forEach((edge) => {
      adjList[edge.source]?.push(edge.target)
      inDegree[edge.target]!++
    })

    // Calculate depths
    const depths: { [key: string]: number } = {}
    const queue = currentJourney.nodes.filter((n) => inDegree[n.id] === 0)

    queue.forEach((node) => {
      depths[node.id] = 0
    })

    while (queue.length > 0) {
      const node = queue.shift()!
      adjList[node.id].forEach((childId) => {
        depths[childId] = Math.max(depths[childId] || 0, (depths[node.id] || 0) + 1)
        inDegree[childId]!--
        if (inDegree[childId] === 0) {
          queue.push(currentJourney.nodes.find((n) => n.id === childId)!)
        }
      })
    }

    // Group nodes by depth
    const nodesByDepth: { [key: number]: string[] } = {}
    currentJourney.nodes.forEach((node) => {
      const depth = depths[node.id] || 0
      if (!nodesByDepth[depth]) nodesByDepth[depth] = []
      nodesByDepth[depth].push(node.id)
    })

    // Detect handoffs (edges where actor changes)
    const handoffs = currentJourney.edges.filter((edge) => {
      const sourceNode = currentJourney.nodes.find((n) => n.id === edge.source)
      const targetNode = currentJourney.nodes.find((n) => n.id === edge.target)
      const sourceActor = sourceNode?.actor?.id || "unassigned"
      const targetActor = targetNode?.actor?.id || "unassigned"
      return sourceActor !== targetActor
    })

    return { actors: allActors, nodesByDepth, handoffs, depths, adjList }
  }, [currentJourney])

  if (!currentJourney || currentJourney.nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        No nodes to display
      </div>
    )
  }

  const maxDepth = Math.max(...Object.keys(actorPaths.nodesByDepth).map(Number), 0)
  const svgWidth = Math.max(1200, (maxDepth + 1) * (NODE_WIDTH + HORIZONTAL_GAP) + 100)
  const svgHeight = Math.max(800, actorPaths.actors.length * SWIMLANE_HEIGHT + 100)

  return (
    <svg
      className="w-full h-full"
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      style={{
        filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.2))",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      }}
    >
      <defs>
        <linearGradient id="swimlaneBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.05)" />
        </linearGradient>
      </defs>

      {/* Swimlanes */}
      {actorPaths.actors.map((actor, index) => (
        <g key={actor.id}>
          {/* Swimlane background */}
          <rect
            x="0"
            y={index * SWIMLANE_HEIGHT}
            width={svgWidth}
            height={SWIMLANE_HEIGHT}
            fill="url(#swimlaneBg)"
            stroke={actor.color}
            strokeWidth="1"
            opacity="0.5"
          />

          {/* Actor label */}
          <rect
            x="10"
            y={index * SWIMLANE_HEIGHT + 10}
            width="120"
            height="40"
            fill={actor.color}
            opacity="0.8"
            rx="4"
          />
          <text
            x="70"
            y={index * SWIMLANE_HEIGHT + 40}
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
            pointerEvents="none"
          >
            {actor.name}
          </text>
        </g>
      ))}

      {/* Nodes positioned in actor swimlanes */}
      {currentJourney.nodes.map((node) => {
        const actor = node.actor || { id: "unassigned", name: "Unassigned" }
        const actorIndex = actorPaths.actors.findIndex((a) => a.id === actor.id)
        const depth = actorPaths.depths?.[node.id] || 0

        const x = 150 + depth * (NODE_WIDTH + HORIZONTAL_GAP)
        const y = actorIndex * SWIMLANE_HEIGHT + SWIMLANE_HEIGHT / 2 - NODE_HEIGHT / 2

        const nodeColor = NODE_COLORS[node.type] || "#6366f1"

        return (
          <g key={node.id}>
            {/* Node box */}
            <rect
              x={x}
              y={y}
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              fill={nodeColor}
              stroke={actor.color}
              strokeWidth="2"
              rx="6"
              opacity="0.85"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
            />

            {/* Node label */}
            <text
              x={x + NODE_WIDTH / 2}
              y={y + NODE_HEIGHT / 2 + 5}
              textAnchor="middle"
              fill="white"
              fontSize="11"
              fontWeight="600"
              pointerEvents="none"
              style={{ wordWrap: "break-word" }}
            >
              {node.label ? node.label.substring(0, 14) : "Node"}
            </text>
          </g>
        )
      })}

      {/* Edges within and across swimlanes */}
      {currentJourney.edges.map((edge) => {
        const sourceNode = currentJourney.nodes.find((n) => n.id === edge.source)
        const targetNode = currentJourney.nodes.find((n) => n.id === edge.target)

        if (!sourceNode || !targetNode) return null

        const sourceActor = sourceNode.actor || { id: "unassigned" }
        const targetActor = targetNode.actor || { id: "unassigned" }

        const sourceActorIndex = actorPaths.actors.findIndex((a) => a.id === sourceActor.id)
        const targetActorIndex = actorPaths.actors.findIndex((a) => a.id === targetActor.id)

        const sourceDepth = actorPaths.depths?.[sourceNode.id] || 0
        const targetDepth = actorPaths.depths?.[targetNode.id] || 0

        const x1 = 150 + sourceDepth * (NODE_WIDTH + HORIZONTAL_GAP) + NODE_WIDTH
        const y1 = sourceActorIndex * SWIMLANE_HEIGHT + SWIMLANE_HEIGHT / 2

        const x2 = 150 + targetDepth * (NODE_WIDTH + HORIZONTAL_GAP)
        const y2 = targetActorIndex * SWIMLANE_HEIGHT + SWIMLANE_HEIGHT / 2

        const isHandoff = sourceActor.id !== targetActor.id

        return (
          <g key={edge.id}>
            {/* Edge path */}
            <path
              d={`M ${x1} ${y1} L ${(x1 + x2) / 2} ${y1} L ${(x1 + x2) / 2} ${y2} L ${x2} ${y2}`}
              fill="none"
              stroke={isHandoff ? "#ff6b6b" : "rgba(100,150,255,0.5)"}
              strokeWidth={isHandoff ? "3" : "2"}
              strokeDasharray={isHandoff ? "0" : "4,4"}
              markerEnd="url(#arrowhead)"
              opacity={isHandoff ? 0.9 : 0.6}
            />

            {/* Handoff indicator */}
            {isHandoff && (
              <circle
                cx={(x1 + x2) / 2}
                cy={(y1 + y2) / 2}
                r="6"
                fill="#ff6b6b"
                opacity="0.8"
              />
            )}
          </g>
        )
      })}

      {/* Arrow marker */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="rgba(100,150,255,0.6)" />
        </marker>
      </defs>

      {/* Legend/Title */}
      <text x="20" y="30" fontSize="14" fontWeight="bold" fill="white">
        Actor Paths View - {currentJourney.nodes.length} nodes, {actorPaths.handoffs.length} handoffs
      </text>
    </svg>
  )
}
