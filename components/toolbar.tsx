"use client"

import type React from "react"
import { useState, useRef } from "react"

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
  FilePlus,
  Trash2,
  ImageIcon,
  LayoutGrid,
} from "lucide-react"
import type { NodeType } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { analyzeJourney, exportToJSON, exportToDAGFormat, exportToCSV } from "@/lib/journey-analysis"
import { ActorManager } from "@/components/actor-manager"
import { exampleJourney } from "@/lib/example-journey"
import { metaJourney } from "@/lib/meta-journey-example"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { calculateAutoLayout, getNewNodePosition, getNodesBounds } from "@/lib/auto-layout"

const nodeTemplates = [
  { type: "touchpoint" as NodeType, label: "Touchpoint", icon: Circle },
  { type: "decision" as NodeType, label: "Decision", icon: GitBranch },
  { type: "handoff" as NodeType, label: "Handoff", icon: Users },
  { type: "process" as NodeType, label: "Process", icon: Cog },
  { type: "endpoint" as NodeType, label: "Endpoint", icon: CheckCircle2 },
]

export function Toolbar() {
  const {
    currentJourney,
    addNode,
    setAnalysis,
    importJourney,
    createNewJourney,
    clearAllNodes,
    updateNode,
    selectedNode,
  } = useJourneyStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [newJourneyName, setNewJourneyName] = useState("")
  const [newJourneyDescription, setNewJourneyDescription] = useState("")

  const handleAddNode = (type: NodeType, label: string) => {
    if (!currentJourney) return

    const position = getNewNodePosition(currentJourney, selectedNode?.id)

    const newNode = {
      id: crypto.randomUUID(),
      type,
      label,
      position,
    }

    addNode(newNode)
  }

  const handleAnalyze = () => {
    if (currentJourney) {
      const analysis = analyzeJourney(currentJourney)
      setAnalysis(analysis)
    }
  }

  const handleAutoLayout = () => {
    if (!currentJourney || currentJourney.nodes.length === 0) return

    const newPositions = calculateAutoLayout(currentJourney)
    newPositions.forEach((position, nodeId) => {
      updateNode(nodeId, { position })
    })
  }

  const handleExportSVG = async () => {
    if (!currentJourney) return

    const flowContainer = document.querySelector(".react-flow") as HTMLElement
    if (!flowContainer) return

    const { toSvg } = await import("html-to-image")

    const bounds = getNodesBounds(currentJourney)

    try {
      const viewport = document.querySelector(".react-flow__viewport") as HTMLElement
      const originalTransform = viewport.style.transform

      const scale = 1.5

      viewport.style.transform = `translate(${-bounds.minX * scale + 50}px, ${-bounds.minY * scale + 50}px) scale(${scale})`

      await new Promise((resolve) => setTimeout(resolve, 100))

      const dataUrl = await toSvg(flowContainer, {
        backgroundColor: "#0a0a0f",
        width: bounds.width * scale + 100,
        height: bounds.height * scale + 100,
        style: {
          width: `${bounds.width * scale + 100}px`,
          height: `${bounds.height * scale + 100}px`,
        },
        filter: (node) => {
          if (node.classList?.contains("react-flow__controls")) return false
          if (node.classList?.contains("react-flow__minimap")) return false
          return true
        },
      })

      viewport.style.transform = originalTransform

      const link = document.createElement("a")
      link.download = `${currentJourney.name.replace(/\s+/g, "-")}.svg`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("Failed to export SVG:", error)
      alert("Failed to export SVG. Please try again.")
    }
  }

  const handleExportPNG = async () => {
    if (!currentJourney) return

    const flowContainer = document.querySelector(".react-flow") as HTMLElement
    if (!flowContainer) return

    const { toPng } = await import("html-to-image")

    const bounds = getNodesBounds(currentJourney)

    try {
      const viewport = document.querySelector(".react-flow__viewport") as HTMLElement
      const originalTransform = viewport.style.transform

      const scale = 1.5

      viewport.style.transform = `translate(${-bounds.minX * scale + 50}px, ${-bounds.minY * scale + 50}px) scale(${scale})`

      await new Promise((resolve) => setTimeout(resolve, 100))

      const dataUrl = await toPng(flowContainer, {
        backgroundColor: "#0a0a0f",
        width: bounds.width * scale + 100,
        height: bounds.height * scale + 100,
        style: {
          width: `${bounds.width * scale + 100}px`,
          height: `${bounds.height * scale + 100}px`,
        },
        filter: (node) => {
          if (node.classList?.contains("react-flow__controls")) return false
          if (node.classList?.contains("react-flow__minimap")) return false
          return true
        },
      })

      viewport.style.transform = originalTransform

      const link = document.createElement("a")
      link.download = `${currentJourney.name.replace(/\s+/g, "-")}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("Failed to export PNG:", error)
      alert("Failed to export PNG. Please try again.")
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

    event.target.value = ""
  }

  const handleNewJourney = () => {
    setNewJourneyName("")
    setNewJourneyDescription("")
    setShowNewDialog(true)
  }

  const handleCreateJourney = () => {
    if (newJourneyName.trim()) {
      createNewJourney(newJourneyName.trim(), newJourneyDescription.trim())
      setShowNewDialog(false)
    }
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all nodes and edges? This cannot be undone.")) {
      clearAllNodes()
    }
  }

  return (
    <div className="border-border flex items-center gap-2 border-b bg-card p-3">
      <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm">
            <FilePlus className="mr-2 h-4 w-4" />
            {"New"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleNewJourney}>
            <FilePlus className="mr-2 h-4 w-4" />
            {"New Journey Map"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleClearAll} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            {"Clear All Nodes"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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

      <Button
        variant="secondary"
        size="sm"
        onClick={handleAutoLayout}
        title="Auto-arrange nodes in a stair-step layout"
      >
        <LayoutGrid className="mr-2 h-4 w-4" />
        {"Auto Layout"}
      </Button>

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
          <DropdownMenuItem onClick={handleExportPNG}>
            <ImageIcon className="mr-2 h-4 w-4" />
            {"Export as PNG"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportSVG}>
            <ImageIcon className="mr-2 h-4 w-4" />
            {"Export as SVG"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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

      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Journey Map</DialogTitle>
            <DialogDescription>Start a fresh journey map. This will replace the current map.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="journey-name">Journey Name</Label>
              <Input
                id="journey-name"
                placeholder="e.g., Customer Onboarding Process"
                value={newJourneyName}
                onChange={(e) => setNewJourneyName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="journey-description">Description (optional)</Label>
              <Textarea
                id="journey-description"
                placeholder="Describe the purpose of this journey map..."
                value={newJourneyDescription}
                onChange={(e) => setNewJourneyDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateJourney} disabled={!newJourneyName.trim()}>
              Create Journey
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
