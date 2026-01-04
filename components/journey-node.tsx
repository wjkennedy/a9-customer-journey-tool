"use client"

import { Handle, Position } from "reactflow"
import { cn } from "@/lib/utils"
import type { JourneyNode } from "@/lib/types"
import { Circle, GitBranch, Users, Cog, CheckCircle2, Sparkles } from "lucide-react"

interface JourneyNodeProps {
  data: {
    journeyNode: JourneyNode
  }
}

const nodeIcons = {
  touchpoint: Circle,
  decision: GitBranch,
  handoff: Users,
  process: Cog,
  endpoint: CheckCircle2,
}

const nodeColors = {
  touchpoint: "bg-blue-500/20 border-blue-500",
  decision: "bg-amber-500/20 border-amber-500",
  handoff: "bg-emerald-500/20 border-emerald-500",
  process: "bg-purple-500/20 border-purple-500",
  endpoint: "bg-red-500/20 border-red-500",
}

export function JourneyNodeComponent({ data }: JourneyNodeProps) {
  const node = data.journeyNode
  const Icon = nodeIcons[node.type]
  const colorClass = nodeColors[node.type]

  return (
    <div
      className={cn(
        "min-w-[180px] rounded-lg border-2 bg-card p-3 shadow-lg transition-all hover:shadow-xl",
        colorClass,
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-primary" />

      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-balance leading-tight">{node.label}</div>
          {node.description && (
            <p className="text-muted-foreground mt-1 text-xs text-pretty leading-tight">{node.description}</p>
          )}
          {node.actor && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: node.actor.color }} />
              <span className="text-muted-foreground">{node.actor.name}</span>
            </div>
          )}
          {node.automationPotential && node.automationPotential !== "none" && (
            <div className="mt-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-accent text-xs capitalize">{node.automationPotential} automation</span>
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-primary" />
    </div>
  )
}
