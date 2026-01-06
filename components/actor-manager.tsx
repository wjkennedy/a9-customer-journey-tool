"use client"

import { useJourneyStore } from "@/lib/journey-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pencil, Trash2, Users } from "lucide-react"
import { useState } from "react"
import type { Actor } from "@/lib/types"

export function ActorManager() {
  const { currentJourney, addActor, updateActor, deleteActor } = useJourneyStore()
  const [isOpen, setIsOpen] = useState(false)
  const [editingActor, setEditingActor] = useState<Actor | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    color: "#3b82f6",
  })

  const handleSubmit = () => {
    if (!formData.name || !formData.role) return

    if (editingActor) {
      updateActor(editingActor.id, formData)
    } else {
      addActor({
        id: crypto.randomUUID(),
        ...formData,
      })
    }

    setFormData({ name: "", role: "", color: "#3b82f6" })
    setEditingActor(null)
    setIsOpen(false)
  }

  const handleEdit = (actor: Actor) => {
    setEditingActor(actor)
    setFormData({
      name: actor.name,
      role: actor.role,
      color: actor.color,
    })
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setEditingActor(null)
    setFormData({ name: "", role: "", color: "#3b82f6" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="mr-2 h-4 w-4" />
          Actors ({currentJourney?.actors.length || 0})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Manage Actors</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{editingActor ? "Edit Actor" : "Add New Actor"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Sales Manager"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-10 w-20"
                  />
                  <Input value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
                </div>
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingActor ? "Update Actor" : "Add Actor"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Current Actors</CardTitle>
            </CardHeader>
            <CardContent>
              {!currentJourney?.actors.length ? (
                <p className="text-muted-foreground text-sm text-center py-4">No actors added yet</p>
              ) : (
                <div className="space-y-2">
                  {currentJourney.actors.map((actor) => (
                    <div
                      key={actor.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full" style={{ backgroundColor: actor.color }} />
                        <div>
                          <p className="font-medium text-sm">{actor.name}</p>
                          <p className="text-muted-foreground text-xs">{actor.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(actor)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteActor(actor.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
