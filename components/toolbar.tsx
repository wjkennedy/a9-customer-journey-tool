"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useJourneyStore } from "@/lib/journey-store"
import {
  Circle,
  GitBranch,
  Users,
  Cog,
  CheckCircle2,
  Plus,
  Download,
  BarChart3,
  FileJson,
  Network,
  Upload,
  FileSpreadsheet,
} from "lucide-react"
import type { NodeType } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { analyzeJourney, exportToJSON, exportToDAGFormat, exportToCSV } from "@/lib/journey-analysis"
import { useRef } from "react"
import { ActorManager } from "@/components/actor-manager"
import { exampleJourney } from "@/lib/example-journey"
import { metaJourney } from "@/lib/meta-journey-example"

const nodeTemplates = [
  { type: "touchpoint" as NodeType, label: "Touchpoint", icon: Circle },
  { type: "decision" as NodeType, label: "Decision", icon: GitBranch },
  { type: "handoff" as NodeType, label: "Handoff", icon: Users },
  { type: "process" as NodeType, label: "Process", icon: Cog },
  { type: "endpoint" as NodeType, label: "Endpoint", icon: CheckCircle2 },
]

export function Toolbar() {
  const { currentJourney, addNode, setAnalysis, importJourney } = useJourneyStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddNode = (type: NodeType, label: string) => {
    if (!currentJourney) return

    const newNode = {
      id: crypto.randomUUID(),
      type,
      label,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
    }

    addNode(newNode)
  }

  const handleAnalyze = () => {
    if (currentJourney) {
      const analysis = analyzeJourney(currentJourney)
      setAnalysis(analysis)
    }
  }

  const handleExportJSON = () => {
    if (currentJourney) {
      const json = exportToJSON(currentJourney)
      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${currentJourney.name.replace(/\s+/g, "-")}.json`
      a.click()
    }
  }

  const handleExportDAG = () => {
    if (currentJourney) {
      const dag = exportToDAGFormat(currentJourney)
      const blob = new Blob([dag], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${currentJourney.name.replace(/\s+/g, "-")}.dot`
      a.click()
    }
  }

  const handleExportCSV = () => {
    if (currentJourney) {
      const csv = exportToCSV(currentJourney)
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${currentJourney.name.replace(/\s+/g, "-")}.csv`
      a.click()
    }
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const journey = JSON.parse(content)
        importJourney(journey)
      } catch (error) {
        console.error("Failed to import journey:", error)
        alert("Failed to import journey. Please ensure the file is a valid JSON export.")
      }
    }
    reader.readAsText(file)

    // Reset input to allow importing the same file again
    event.target.value = ""
  }

  return (
    <div className="border-border flex items-center gap-2 border-b bg-card p-3">
      <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            {"Add Node"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {nodeTemplates.map((template) => (
            <DropdownMenuItem key={template.type} onClick={() => handleAddNode(template.type, template.label)}>
              <template.icon className="mr-2 h-4 w-4" />
              {template.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="border-border mx-2 h-6 w-px bg-border" />

      <ActorManager />

      <Button variant="secondary" size="sm" onClick={handleAnalyze}>
        <BarChart3 className="mr-2 h-4 w-4" />
        {"Analyze"}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm">
            <FileJson className="mr-2 h-4 w-4" />
            {"Examples"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => importJourney(exampleJourney)}>
            <Cog className="mr-2 h-4 w-4" />
            {"Sales Process Example"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => importJourney(metaJourney)}>
            <Network className="mr-2 h-4 w-4" />
            {"Tool Discovery Journey (Meta)"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="secondary" size="sm" onClick={handleImport}>
        <Upload className="mr-2 h-4 w-4" />
        {"Import"}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm">
            <Download className="mr-2 h-4 w-4" />
            {"Export"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleExportJSON}>
            <FileJson className="mr-2 h-4 w-4" />
            {"Export as JSON"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportCSV}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            {"Export as CSV"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportDAG}>
            <Network className="mr-2 h-4 w-4" />
            {"Export as DAG (Graphviz)"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
