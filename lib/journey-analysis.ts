import type { CustomerJourney, AnalysisResult, JourneyNode } from "./types"

export function analyzeJourney(journey: CustomerJourney): AnalysisResult {
  const handoffCount = journey.nodes.filter((node) => node.type === "handoff").length
  const decisionPoints = journey.nodes.filter((node) => node.type === "decision").length

  // Calculate estimated duration
  const totalMinutes = journey.nodes.reduce((sum, node) => {
    if (node.duration) {
      const match = node.duration.match(/(\d+)/)
      return sum + (match ? Number.parseInt(match[1]) : 0)
    }
    return sum
  }, 0)

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const estimatedDuration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`

  // Identify automation opportunities
  const automationOpportunities = journey.nodes
    .filter(
      (node) =>
        node.automationPotential === "high" ||
        node.type === "process" ||
        (node.criteria && node.criteria.some((c) => c.type === "automatic")),
    )
    .map((node) => ({
      nodeId: node.id,
      description: `Automate "${node.label}" - ${node.description || "Repetitive task suitable for automation"}`,
      priority: node.automationPotential || ("medium" as "high" | "medium" | "low"),
    }))

  // Identify AI agent opportunities
  const aiAgentOpportunities = journey.nodes
    .filter(
      (node) =>
        node.aiOpportunity ||
        node.type === "decision" ||
        (node.label && node.label.toLowerCase().includes("review")) ||
        (node.label && node.label.toLowerCase().includes("analyze")),
    )
    .map((node) => ({
      nodeId: node.id,
      description: node.aiOpportunity || `AI agent could assist with "${node.label}"`,
      capability: determineAICapability(node),
    }))

  // Identify bottlenecks (handoffs and decisions without clear criteria)
  const bottlenecks = journey.nodes
    .filter(
      (node) =>
        (node.type === "handoff" && !node.criteria) ||
        (node.type === "decision" && (!node.criteria || node.criteria.length === 0)),
    )
    .map((node) => ({
      nodeId: node.id,
      reason: node.type === "handoff" ? "Handoff lacks defined criteria" : "Decision point needs clear criteria",
    }))

  return {
    totalSteps: journey.nodes.length,
    handoffCount,
    decisionPoints,
    estimatedDuration,
    automationOpportunities,
    aiAgentOpportunities,
    bottlenecks,
  }
}

function determineAICapability(node: JourneyNode): string {
  const label = node.label?.toLowerCase() || ""

  if (label.includes("review") || label.includes("check")) return "Document Review & Validation"
  if (label.includes("analyze") || label.includes("assess")) return "Data Analysis & Insights"
  if (label.includes("route") || label.includes("assign")) return "Intelligent Routing"
  if (label.includes("respond") || label.includes("answer")) return "Natural Language Response"
  if (node.type === "decision") return "Decision Support"

  return "General AI Assistance"
}

export function exportToJSON(journey: CustomerJourney): string {
  return JSON.stringify(journey, null, 2)
}

export function exportToDAGFormat(journey: CustomerJourney): string {
  // Export in a standard DAG format compatible with graphviz
  let dot = "digraph CustomerJourney {\n"
  dot += "  rankdir=LR;\n"
  dot += "  node [shape=box, style=rounded];\n\n"

  // Add nodes
  journey.nodes.forEach((node) => {
    const color = getNodeColor(node.type)
    const label = `${node.label}${node.actor ? `\\n(${node.actor.name})` : ""}`
    dot += `  "${node.id}" [label="${label}", fillcolor="${color}", style="rounded,filled"];\n`
  })

  dot += "\n"

  // Add edges
  journey.edges.forEach((edge) => {
    const label = edge.label ? ` [label="${edge.label}"]` : ""
    dot += `  "${edge.source}" -> "${edge.target}"${label};\n`
  })

  dot += "}\n"

  return dot
}

function getNodeColor(type: string): string {
  switch (type) {
    case "touchpoint":
      return "#3b82f6"
    case "decision":
      return "#f59e0b"
    case "handoff":
      return "#10b981"
    case "process":
      return "#8b5cf6"
    case "endpoint":
      return "#ef4444"
    default:
      return "#6b7280"
  }
}

export function exportToCSV(journey: CustomerJourney): string {
  const headers = [
    "Node ID",
    "Type",
    "Label",
    "Description",
    "Actor",
    "Actor Role",
    "Duration",
    "Automation Potential",
    "AI Opportunity",
    "Criteria Count",
    "Connected To",
  ]

  const rows = journey.nodes.map((node) => {
    const connectedNodes = journey.edges
      .filter((edge) => edge.source === node.id)
      .map((edge) => {
        const targetNode = journey.nodes.find((n) => n.id === edge.target)
        return targetNode ? targetNode.label : edge.target
      })
      .join("; ")

    return [
      node.id,
      node.type,
      node.label,
      node.description || "",
      node.actor?.name || "",
      node.actor?.role || "",
      node.duration || "",
      node.automationPotential || "",
      node.aiOpportunity || "",
      node.criteria?.length.toString() || "0",
      connectedNodes,
    ]
  })

  const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

  return csvContent
}

export function exportRecommendations(analysis: AnalysisResult, journeyName: string): string {
  let text = `# Customer Journey Analysis: ${journeyName}\n\n`

  text += `## Journey Overview\n`
  text += `- Total Steps: ${analysis.totalSteps}\n`
  text += `- Handoffs: ${analysis.handoffCount}\n`
  text += `- Decision Points: ${analysis.decisionPoints}\n`
  text += `- Estimated Duration: ${analysis.estimatedDuration}\n\n`

  if (analysis.automationOpportunities.length > 0) {
    text += `## Automation Opportunities (${analysis.automationOpportunities.length})\n\n`
    analysis.automationOpportunities.forEach((opp, idx) => {
      text += `${idx + 1}. [${opp.priority.toUpperCase()}] ${opp.description}\n`
    })
    text += `\n`
  }

  if (analysis.aiAgentOpportunities.length > 0) {
    text += `## AI Agent Opportunities (${analysis.aiAgentOpportunities.length})\n\n`
    analysis.aiAgentOpportunities.forEach((opp, idx) => {
      text += `${idx + 1}. ${opp.capability}\n   ${opp.description}\n`
    })
    text += `\n`
  }

  if (analysis.bottlenecks.length > 0) {
    text += `## Potential Bottlenecks (${analysis.bottlenecks.length})\n\n`
    analysis.bottlenecks.forEach((bottleneck, idx) => {
      text += `${idx + 1}. ${bottleneck.reason}\n`
    })
    text += `\n`
  }

  text += `---\n`
  text += `Generated by A9 Customer Journey Tool\n`
  text += `${new Date().toLocaleString()}\n`

  return text
}
