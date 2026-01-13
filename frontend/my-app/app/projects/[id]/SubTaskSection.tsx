"use client"
import DeleteSubtaskButton from "./DeleteSubTaskButton"
import EditSubtaskButton from "./EditSubTaskButton"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type Subtask = {
  Id: number
  TaskId: number
  Title: string
  Description: string
  IsDeleted: boolean
}

function normalizeSubtask(s: any, taskId: number): Subtask {
  return {
    Id: s?.Id ?? s?.id ?? 0,
    TaskId: s?.TaskId ?? s?.taskId ?? taskId,
    Title: s?.Title ?? s?.title ?? "No Title",
    Description: s?.Description ?? s?.description ?? "",
    IsDeleted: s?.IsDeleted ?? s?.isDeleted ?? false,
  }
}



function AddSubtaskButton({ projectId, taskId }: { projectId: number; taskId: number }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Subtask title is required.")
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}/subtasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `HTTP ${res.status}`)
      }

      setTitle("")
      setDescription("")
      setOpen(false)

      window.dispatchEvent(new Event(`subtasks:changed:${taskId}`))
    } catch (e: any) {
      setError(e?.message ?? "Failed to create subtask. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Add Subtask
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add subtask</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`subtask-title-${taskId}`}>Title</Label>
            <Input
              id={`subtask-title-${taskId}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Add validation"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`subtask-desc-${taskId}`}>Description</Label>
            <Textarea
              id={`subtask-desc-${taskId}`}
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
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function SubtaskSection({
  projectId,
  taskId,
}: {
  projectId: number
  taskId: number
}) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function load() {
    try {
      setError("")
      setLoading(true)

      const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}/subtasks`, {
        cache: "no-store",
      })
      const text = await res.text().catch(() => "")

      if (!res.ok) {
        throw new Error(text || `HTTP ${res.status}`)
      }

      const raw = text ? JSON.parse(text) : []
      const arr = Array.isArray(raw) ? raw : [raw]
      setSubtasks(arr.map((x) => normalizeSubtask(x, taskId)))
    } catch (e: any) {
      setError(e?.message ?? "Failed to load subtasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()

    const key = `subtasks:changed:${taskId}`
    function onChanged() {
      load()
    }

    window.addEventListener(key, onChanged)
    return () => window.removeEventListener(key, onChanged)
  }, [projectId, taskId])

  const active = subtasks.filter((s) => !s.IsDeleted)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Subtasks</p>
        <AddSubtaskButton projectId={projectId} taskId={taskId} />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading subtasks...</p>
      ) : error ? (
        <div className="space-y-2">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="secondary" size="sm" onClick={load}>
            Retry
          </Button>
        </div>
      ) : active.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No subtasks yet. Click <span className="font-medium text-foreground">Add Subtask</span>.
        </p>
      ) : (
        <ul className="space-y-2">
          {active.map((s) => (
            <li
              key={s.Id}
              className="rounded-md border bg-background px-3 py-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                <p className="text-sm font-medium leading-5 truncate">{s.Title}</p>

                {s.Description ? (
                <p className="mt-1 ml-4 text-xs text-muted-foreground">
                {s.Description}
                </p>
                ) : null}
                </div>

                <div className="flex items-center gap-2">
            <EditSubtaskButton projectId={projectId} taskId={taskId} subtask={s} />
                <DeleteSubtaskButton projectId={projectId} taskId={taskId} subtaskId={s.Id} />
  </div>
</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}