"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import BackToProjectsButton from "./BackToProjectsButton"

type Status = "ToDO" | "InProgress" | "Done"
type Priority = "Low" | "Medium" | "High" | "Urgent"

const statusMap = { ToDO: 0, InProgress: 1, Done: 2 } as const
const priorityMap = { Low: 0, Medium: 1, High: 2, Urgent: 3 } as const

export default function CreateTask({ projectId }: { projectId: number }) {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<Status>("ToDO")
  const [priority, setPriority] = useState<Priority>("Medium")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Task title is required.")
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          status: statusMap[status],
          priority: priorityMap[priority],
        }),
      })

      if (!res.ok) {
        const t = await res.text().catch(() => "")
        throw new Error(t || `HTTP ${res.status}`)
      }

      setTitle("")
      setDescription("")
      setStatus("ToDO")
      setPriority("Medium")
      setOpen(false)

      router.refresh()
      window.dispatchEvent(new Event("tasks:changed"))
    } catch (e: any) {
      setError(e?.message ?? "Failed to create task. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <BackToProjectsButton />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>New Task</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create task</DialogTitle>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`task-title-${projectId}`}>Title</Label>
              <Input
                id={`task-title-${projectId}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Add restore endpoint"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`task-desc-${projectId}`}>Description</Label>
              <Textarea
                id={`task-desc-${projectId}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description (optional)"
                className="min-h-[100px]"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                  disabled={loading}
                >
                  <option value="ToDO">To Do</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <select
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  disabled={loading}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
