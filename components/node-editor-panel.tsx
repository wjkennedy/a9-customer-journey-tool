"use client"

import { useJourneyStore } from "@/lib/journey-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import type { NodeType } from "@/lib/types"

export function NodeEditorPanel() {
  const { selectedNode, updateNode, deleteNode, setSelectedNode, currentJourney } = useJourneyStore()
  const [criteriaInput, setCriteriaInput] = useState("")

  if (!selectedNode) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-muted-foreground text-sm text-center">{"Select a node to edit its properties"}</p>
      </div>
    )
  }

  const handleUpdate = (field: string, value: unknown) => {
    updateNode(selectedNode.id, { [field]: value })
  }

  const handleAddCriteria = () => {
    if (criteriaInput.trim()) {
      const newCriteria = {
        id: crypto.randomUUID(),
        condition: criteriaInput,
        type: "manual" as const,
      }
      const updatedCriteria = [...(selectedNode.criteria || []), newCriteria]
      updateNode(selectedNode.id, { criteria: updatedCriteria })
      setCriteriaInput("")
    }
  }

  const handleRemoveCriteria = (id: string) => {
    const updatedCriteria = selectedNode.criteria?.filter((c) => c.id !== id)
    updateNode(selectedNode.id, { criteria: updatedCriteria })
  }

  const handleDelete = () => {
    deleteNode(selectedNode.id)
    setSelectedNode(null)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-border flex items-center justify-between border-b p-4">
        <h3 className="font-semibold">{"Node Properties"}</h3>
        <Button variant="ghost" size="icon" onClick={() => setSelectedNode(null)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-4 overflow-auto p-4">
        <div className="space-y-2">
          <Label htmlFor="label">{"Label"}</Label>
          <Input id="label" value={selectedNode.label} onChange={(e) => handleUpdate("label", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{"Description"}</Label>
          <Textarea
            id="description"
            value={selectedNode.description || ""}
            onChange={(e) => handleUpdate("description", e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">{"Node Type"}</Label>
          <Select value={selectedNode.type} onValueChange={(value) => handleUpdate("type", value as NodeType)}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="touchpoint">{"Touchpoint"}</SelectItem>
              <SelectItem value="decision">{"Decision"}</SelectItem>
              <SelectItem value="handoff">{"Handoff"}</SelectItem>
              <SelectItem value="process">{"Process"}</SelectItem>
              <SelectItem value="endpoint">{"Endpoint"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="actor">{"Actor"}</Label>
          <Select
            value={selectedNode.actor?.id || "none"}
            onValueChange={(value) => {
              const actor = currentJourney?.actors.find((a) => a.id === value)
              handleUpdate("actor", actor)
            }}
          >
            <SelectTrigger id="actor">
              <SelectValue placeholder="Select actor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{"None"}</SelectItem>
              {currentJourney?.actors.map((actor) => (
                <SelectItem key={actor.id} value={actor.id}>
                  {actor.name} ({actor.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">{"Duration"}</Label>
          <Input
            id="duration"
            value={selectedNode.duration || ""}
            onChange={(e) => handleUpdate("duration", e.target.value)}
            placeholder="e.g., 30 minutes"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="automation">{"Automation Potential"}</Label>
          <Select
            value={selectedNode.automationPotential || "none"}
            onValueChange={(value) => handleUpdate("automationPotential", value)}
          >
            <SelectTrigger id="automation">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{"None"}</SelectItem>
              <SelectItem value="low">{"Low"}</SelectItem>
              <SelectItem value="medium">{"Medium"}</SelectItem>
              <SelectItem value="high">{"High"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ai-opportunity">{"AI Opportunity"}</Label>
          <Textarea
            id="ai-opportunity"
            value={selectedNode.aiOpportunity || ""}
            onChange={(e) => handleUpdate("aiOpportunity", e.target.value)}
            placeholder="Describe potential AI agent capabilities..."
            rows={2}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{"Transition Criteria"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={criteriaInput}
                onChange={(e) => setCriteriaInput(e.target.value)}
                placeholder="Add criteria..."
                onKeyDown={(e) => e.key === "Enter" && handleAddCriteria()}
              />
              <Button size="icon" onClick={handleAddCriteria}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {selectedNode.criteria?.map((criteria) => (
                <div key={criteria.id} className="flex items-center justify-between gap-2 rounded bg-secondary p-2">
                  <span className="text-sm">{criteria.condition}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveCriteria(criteria.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border-border border-t p-4">
        <Button variant="destructive" className="w-full" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          {"Delete Node"}
        </Button>
      </div>
    </div>
  )
}
