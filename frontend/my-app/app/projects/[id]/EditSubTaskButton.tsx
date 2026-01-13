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

type Subtask = {
  Id: number
  TaskId: number
  Title: string
  Description: string
}

export default function EditSubtaskButton({
  projectId,
  taskId,
  subtask,
}: {
  projectId: number
  taskId: number
  subtask: Subtask
}) {
  const [open, setOpen] = useState(false)

  const [title, setTitle] = useState(subtask.Title ?? "")
  const [description, setDescription] = useState(subtask.Description ?? "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setTitle(subtask.Title ?? "")
    setDescription(subtask.Description ?? "")
  }, [subtask])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Subtask title is required.")
      return
    }

    try {
      setLoading(true)

      const res = await fetch(
        `/api/projects/${projectId}/tasks/${taskId}/subtasks/${subtask.Id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
          }),
        }
      )

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `HTTP ${res.status}`)
      }

      setOpen(false)
      window.dispatchEvent(new Event(`subtasks:changed:${taskId}`))
    } catch (e: any) {
      setError(e?.message ?? "Failed to update subtask. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit subtask</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`subtask-title-${subtask.Id}`}>Title</Label>
            <Input
              id={`subtask-title-${subtask.Id}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Subtask title"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`subtask-desc-${subtask.Id}`}>Description</Label>
            <Textarea
              id={`subtask-desc-${subtask.Id}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description (optional)"
              className="min-h-[90px]"
              disabled={loading}
            />
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
