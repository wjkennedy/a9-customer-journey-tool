"use client"

import { useEffect, useState } from "react"
import { useJourneyStore } from "@/lib/journey-store"
import { JourneyCanvas } from "@/components/journey-canvas"
import { NodeEditorPanel } from "@/components/node-editor-panel"
import { AnalysisPanel } from "@/components/analysis-panel"
import { Toolbar } from "@/components/toolbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Network } from "lucide-react"
import { metaJourney } from "@/lib/meta-journey-example"

export default function HomePage() {
  const { currentJourney, createNewJourney, importJourney } = useJourneyStore()
  const [showNewJourneyDialog, setShowNewJourneyDialog] = useState(false)
  const [journeyName, setJourneyName] = useState("")
  const [journeyDescription, setJourneyDescription] = useState("")

  useEffect(() => {
    if (!currentJourney) {
      importJourney(metaJourney)
    }
  }, [currentJourney, importJourney])

  const handleCreateJourney = () => {
    if (journeyName.trim()) {
      createNewJourney(journeyName, journeyDescription)
      setShowNewJourneyDialog(false)
      setJourneyName("")
      setJourneyDescription("")
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="border-border flex items-center justify-between border-b bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Network className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-balance">{"Journey Mapper"}</h1>
            <p className="text-muted-foreground text-xs">{"by A9 Consulting Group"}</p>
          </div>
        </div>
        {currentJourney && (
          <div className="text-right">
            <h2 className="font-semibold text-balance">{currentJourney.name}</h2>
            <p className="text-muted-foreground text-sm text-pretty">{currentJourney.description}</p>
          </div>
        )}
      </header>

      <Toolbar />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1">
          <JourneyCanvas />
        </div>

        <div className="border-border w-80 border-l bg-card">
          <Tabs defaultValue="properties" className="h-full">
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger value="properties" className="flex-1">
                {"Properties"}
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex-1">
                {"Analysis"}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="properties" className="h-[calc(100%-3rem)] m-0">
              <NodeEditorPanel />
            </TabsContent>
            <TabsContent value="analysis" className="h-[calc(100%-3rem)] m-0">
              <AnalysisPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={showNewJourneyDialog} onOpenChange={setShowNewJourneyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{"Create New Customer Journey"}</DialogTitle>
            <DialogDescription>
              {"Define your journey to start mapping touchpoints, transitions, and optimization opportunities."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{"Journey Name"}</Label>
              <Input
                id="name"
                value={journeyName}
                onChange={(e) => setJourneyName(e.target.value)}
                placeholder="e.g., Customer Onboarding"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{"Description"}</Label>
              <Textarea
                id="description"
                value={journeyDescription}
                onChange={(e) => setJourneyDescription(e.target.value)}
                placeholder="Describe the purpose and scope of this journey..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateJourney}>{"Create Journey"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
