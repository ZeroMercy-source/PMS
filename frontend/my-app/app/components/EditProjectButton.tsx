"use client"

import { useEffect, useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Status = "ToDo" | "InProgress" | "Done" | "Deleted"
type Priority = "Low" | "Medium" | "High" | "Urgent"

type Project = {
  Id: number
  Title: string
  Description: string
  Status: Status | string
  Priority: Priority | string
}

const statusMap = { ToDo: 0, InProgress: 1, Done: 2, Deleted: 3 } as const
const priorityMap = { Low: 0, Medium: 1, High: 2, Urgent: 3 } as const

export default function EditProjectButton({ project }: { project: Project }) {
  const [open, setOpen] = useState(false)

  const [title, setTitle] = useState(project.Title ?? "")
  const [description, setDescription] = useState(project.Description ?? "")
  const [status, setStatus] = useState<Status>((project.Status as Status) ?? "ToDo")
  const [priority, setPriority] = useState<Priority>((project.Priority as Priority) ?? "Medium")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setTitle(project.Title ?? "")
    setDescription(project.Description ?? "")
    setStatus((project.Status as Status) ?? "ToDo")
    setPriority((project.Priority as Priority) ?? "Medium")
  }, [project])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Project title is required.")
      return
    }

    try {
      setLoading(true)
const res = await fetch(`/api/projects/${project.Id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title,
    description,
    status: statusMap[status],      
    priority: priorityMap[priority], 
  }),
})

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `HTTP ${res.status}`)
      }

      setOpen(false)
      window.dispatchEvent(new Event("projects:changed"))
    } catch (e: any) {
      setError(e?.message ?? "Failed to update project. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Edit</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`title-${project.Id}`}>Title</Label>
            <Input
              id={`title-${project.Id}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`desc-${project.Id}`}>Description</Label>
            <Textarea
              id={`desc-${project.Id}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project description"
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ToDo">To Do</SelectItem>
                  <SelectItem value="InProgress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
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
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
