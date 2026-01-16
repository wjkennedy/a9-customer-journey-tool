"use client"

import type React from "react"

import { useCallback, useEffect, useRef } from "react"
import ReactFlow, {
  type Node,
  type Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  BackgroundVariant,
  MarkerType,
  ConnectionMode,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow"
import "reactflow/dist/style.css"
import { useJourneyStore } from "@/lib/journey-store"
import { JourneyNodeComponent } from "./journey-node"

const nodeTypes = {
  custom: JourneyNodeComponent,
}

export const NODE_WIDTH = 200
export const NODE_HEIGHT = 80
export const HORIZONTAL_GAP = 250
export const VERTICAL_STEP = NODE_HEIGHT * 0.7 // 70% of node height as vertical separator

function JourneyCanvasInner() {
  const { currentJourney, updateNode, addEdge: addJourneyEdge, setSelectedNode, setJourney } = useJourneyStore()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { getNodes, toObject } = useReactFlow()
  const flowWrapperRef = useRef<HTMLDivElement>(null)

  // Sync journey store with ReactFlow state
  useEffect(() => {
    if (currentJourney) {
      const flowNodes: Node[] = currentJourney.nodes.map((node) => ({
        id: node.id,
        type: "custom",
        position: node.position,
        data: { ...node, journeyNode: node },
      }))

      const flowEdges: Edge[] = currentJourney.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: null,
        targetHandle: null,
        label: edge.label,
        type: "smoothstep",
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: {
          stroke: edge.type === "conditional" ? "#f59e0b" : "#64748b",
          strokeWidth: 2,
        },
        labelStyle: {
          fill: "#94a3b8",
          fontSize: 12,
        },
        labelBgStyle: {
          fill: "#1e293b",
        },
      }))

      setNodes(flowNodes)
      setEdges(flowEdges)
    }
  }, [currentJourney, setNodes, setEdges])

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        const newEdge = {
          id: crypto.randomUUID(),
          source: connection.source,
          target: connection.target,
          type: "default" as const,
        }
        addJourneyEdge(newEdge)
      }
      setEdges((eds) => addEdge(connection, eds))
    },
    [addJourneyEdge, setEdges],
  )

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const journeyNode = currentJourney?.nodes.find((n) => n.id === node.id)
      if (journeyNode) {
        setSelectedNode(journeyNode)
      }
    },
    [currentJourney, setSelectedNode],
  )

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      updateNode(node.id, { position: node.position })
    },
    [updateNode],
  )

  if (!currentJourney) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">{"No journey loaded"}</p>
          <p className="text-muted-foreground text-sm">{"Create a new journey to get started"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full" ref={flowWrapperRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Strict}
        defaultEdgeOptions={{
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
        }}
        fitView
        className="bg-background"
      >
        <Controls className="bg-card border-border" />
        <MiniMap className="bg-card border-border" nodeColor="#3b82f6" />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#333" />
      </ReactFlow>
    </div>
  )
}

export function JourneyCanvas() {
  return (
    <ReactFlowProvider>
      <JourneyCanvasInner />
    </ReactFlowProvider>
  )
}
