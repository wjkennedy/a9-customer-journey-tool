"use client"

import React, { useEffect, useRef } from "react"
import { useJourneyStore } from "@/lib/journey-store"
import { NODE_COLORS } from "@/components/journey-node"

export function IsometricView() {
  const { currentJourney } = useJourneyStore()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !currentJourney || currentJourney.nodes.length === 0) {
      return
    }

    // Dynamically import isometric to avoid SSR issues
    import("isometric").then(({ Isometric, Path, Point }) => {
      containerRef.current!.innerHTML = ""

      const width = containerRef.current!.clientWidth
      const height = containerRef.current!.clientHeight

      // Create SVG element
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svg.setAttribute("width", width.toString())
      svg.setAttribute("height", height.toString())
      svg.setAttribute("style", "background-color: #1a1a2e;")

      const iso = new Isometric()

      // Create isometric representation of journey
      const nodeSpacing = 200
      const startX = 100
      const startY = 50

      currentJourney.nodes.forEach((node, index) => {
        const nodeColor = NODE_COLORS[node.type] || "#6366f1"
        const y = startY + index * nodeSpacing

        // Create a simple isometric cube representation using paths
        const cubeSize = 60
        const origin = new Point(startX, y, 0)

        // Front face (rectangle)
        const rect = new Path({
          fill: nodeColor,
          stroke: "#fff",
          strokeWidth: 2,
        })

        // Simple rectangle to represent node
        const points = [
          new Point(startX, y, 0),
          new Point(startX + cubeSize, y, 0),
          new Point(startX + cubeSize, y + cubeSize, 0),
          new Point(startX, y + cubeSize, 0),
        ]

        points.forEach((point, idx) => {
          if (idx === 0) {
            rect.moveTo(iso.project(point))
          } else {
            rect.lineTo(iso.project(point))
          }
        })
        rect.closePath()

        // Add text label
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
        text.setAttribute("x", (startX + cubeSize / 2).toString())
        text.setAttribute("y", (y + cubeSize / 2 + 5).toString())
        text.setAttribute("text-anchor", "middle")
        text.setAttribute("fill", "#fff")
        text.setAttribute("font-size", "12")
        text.setAttribute("font-family", "sans-serif")
        text.textContent = node.label || node.type

        svg.appendChild(rect.el)
        svg.appendChild(text)
      })

      containerRef.current!.appendChild(svg)
    })
  }, [currentJourney])

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
