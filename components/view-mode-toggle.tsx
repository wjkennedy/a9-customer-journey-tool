"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useJourneyStore } from "@/lib/journey-store"
import { GripVertical, Box, GitBranch } from "lucide-react"

export function ViewModeToggle() {
  const { viewMode, setViewMode } = useJourneyStore()

  const viewModes = [
    { id: "standard", label: "Standard Flow", icon: GripVertical },
    { id: "isometric", label: "Isometric View", icon: Box },
    { id: "actor-paths", label: "Actor Paths", icon: GitBranch },
  ]

  const currentMode = viewModes.find((m) => m.id === viewMode)
  const CurrentIcon = currentMode?.icon || GripVertical

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          title="Switch visualization mode"
        >
          <CurrentIcon className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">{currentMode?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {viewModes.map((mode) => {
          const ModeIcon = mode.icon
          return (
            <DropdownMenuItem
              key={mode.id}
              onClick={() => setViewMode(mode.id as "standard" | "isometric" | "actor-paths")}
              className={viewMode === mode.id ? "bg-accent" : ""}
            >
              <ModeIcon className="mr-2 h-4 w-4" />
              {mode.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
