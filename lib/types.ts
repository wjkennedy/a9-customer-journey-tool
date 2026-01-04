export type NodeType = "touchpoint" | "decision" | "handoff" | "process" | "endpoint"

export interface Actor {
  id: string
  name: string
  role: string
  color: string
}

export interface TransitionCriteria {
  id: string
  condition: string
  type: "automatic" | "manual" | "conditional"
}

export interface JourneyNode {
  id: string
  type: NodeType
  label: string
  description?: string
  actor?: Actor
  duration?: string
  criteria?: TransitionCriteria[]
  automationPotential?: "high" | "medium" | "low" | "none"
  aiOpportunity?: string
  position: { x: number; y: number }
  data?: Record<string, unknown>
}

export interface JourneyEdge {
  id: string
  source: string
  target: string
  label?: string
  criteria?: TransitionCriteria
  type?: "default" | "conditional" | "parallel"
}

export interface CustomerJourney {
  id: string
  name: string
  description: string
  nodes: JourneyNode[]
  edges: JourneyEdge[]
  actors: Actor[]
  createdAt: string
  updatedAt: string
  metadata?: Record<string, unknown>
}

export interface AnalysisResult {
  totalSteps: number
  handoffCount: number
  decisionPoints: number
  estimatedDuration: string
  automationOpportunities: Array<{
    nodeId: string
    description: string
    priority: "high" | "medium" | "low"
  }>
  aiAgentOpportunities: Array<{
    nodeId: string
    description: string
    capability: string
  }>
  bottlenecks: Array<{
    nodeId: string
    reason: string
  }>
}
