"use client"

import { useJourneyStore } from "@/lib/journey-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { TrendingUp, GitBranch, Users, Clock, Sparkles, Bot, AlertTriangle, Copy, Check } from "lucide-react"
import { exportRecommendations } from "@/lib/journey-analysis"
import { useState } from "react"

export function AnalysisPanel() {
  const { analysis, currentJourney } = useJourneyStore()
  const [copied, setCopied] = useState(false)

  if (!analysis) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-muted-foreground text-center text-sm">
          {'Click "Analyze" to generate insights and identify optimization opportunities'}
        </p>
      </div>
    )
  }

  const handleCopyRecommendations = async () => {
    if (!currentJourney) return

    const text = exportRecommendations(analysis, currentJourney.name)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Analysis Results</h3>
          <Button variant="outline" size="sm" onClick={handleCopyRecommendations} className="gap-2 bg-transparent">
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy All
              </>
            )}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              {"Journey Overview"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">{"Total Steps"}</span>
              <Badge variant="secondary">{analysis.totalSteps}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">{"Handoffs"}</span>
              <Badge variant="secondary">
                <Users className="mr-1 h-3 w-3" />
                {analysis.handoffCount}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">{"Decision Points"}</span>
              <Badge variant="secondary">
                <GitBranch className="mr-1 h-3 w-3" />
                {analysis.decisionPoints}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">{"Est. Duration"}</span>
              <Badge variant="secondary">
                <Clock className="mr-1 h-3 w-3" />
                {analysis.estimatedDuration}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {analysis.automationOpportunities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-accent" />
                {"Automation Opportunities"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.automationOpportunities.map((opp, idx) => (
                <div key={idx} className="rounded-lg bg-secondary p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <Badge
                      variant={
                        opp.priority === "high" ? "default" : opp.priority === "medium" ? "secondary" : "outline"
                      }
                      className="text-xs"
                    >
                      {opp.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-pretty leading-relaxed">{opp.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {analysis.aiAgentOpportunities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bot className="h-4 w-4 text-primary" />
                {"AI Agent Opportunities"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.aiAgentOpportunities.map((opp, idx) => (
                <div key={idx} className="rounded-lg bg-secondary p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {opp.capability}
                    </Badge>
                  </div>
                  <p className="text-sm text-pretty leading-relaxed">{opp.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {analysis.bottlenecks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                {"Potential Bottlenecks"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.bottlenecks.map((bottleneck, idx) => (
                <div key={idx} className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                  <p className="text-sm text-pretty leading-relaxed">{bottleneck.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  )
}
