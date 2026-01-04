"use client"

import { useJourneyStore } from "@/lib/journey-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrendingUp, GitBranch, Users, Clock, Sparkles, Bot, AlertTriangle } from "lucide-react"

export function AnalysisPanel() {
  const { analysis } = useJourneyStore()

  if (!analysis) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-muted-foreground text-center text-sm">
          {'Click "Analyze" to generate insights and identify optimization opportunities'}
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
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
