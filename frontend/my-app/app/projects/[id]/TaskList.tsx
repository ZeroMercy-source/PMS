// app/projects/[id]/TaskList.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DeleteTaskButton from "./DeleteTaskButton"
import EditTaskButton from "./EditTaskButton"
import SubtaskSection from "./SubTaskSection"

type Task = {
  Id: number
  ProjectId: number
  Title: string
  Description: string
  IsDeleted: boolean
  Status: string
  Priority: string
}

function normalizeTask(t: any, projectId: number): Task {
  return {
    Id: t?.Id ?? t?.id ?? 0,
    ProjectId: projectId,
    Title: t?.Title ?? t?.title ?? "No Title",
    Description: t?.Description ?? t?.description ?? "No Description",
    IsDeleted: t?.IsDeleted ?? t?.isDeleted ?? false,
    Status: String(t?.Status ?? t?.status ?? "ToDO"),
    Priority: String(t?.Priority ?? t?.priority ?? "Medium"),
  }
}

export default function TaskList({ projectId }: { projectId: number }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function load() {
    try {
      setError("")
      setLoading(true)

      const res = await fetch(`/api/projects/${projectId}/tasks`, { cache: "no-store" })
      const text = await res.text().catch(() => "")

      if (!res.ok) throw new Error(text || `HTTP ${res.status}`)

      const raw = text ? JSON.parse(text) : []
      const arr = Array.isArray(raw) ? raw : [raw]
      setTasks(arr.map((x) => normalizeTask(x, projectId)))
    } catch (e: any) {
      setError(e?.message ?? "Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()

    function onChanged() {
      load()
    }

    window.addEventListener("tasks:changed", onChanged)
    return () => window.removeEventListener("tasks:changed", onChanged)
  }, [projectId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading tasks...</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Fetching from backend.
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Couldn&apos;t load tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="secondary" onClick={load}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const active = tasks.filter((t) => !t.IsDeleted)

  if (!active.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No tasks yet</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Click <span className="font-medium text-foreground">New Task</span>{" "}
          to create your first one.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {active.map((t) => (
        <Card key={t.Id} className="transition-all hover:shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-base leading-6">{t.Title}</CardTitle>
              <Badge variant="secondary">{t.Status}</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {t.Description}
            </p>

            <div className="flex items-center justify-between">
              <Badge variant="outline">{t.Priority}</Badge>

              <div className="flex items-center gap-2">
                <EditTaskButton task={t as any} />
                <DeleteTaskButton projectId={projectId} taskId={t.Id} />
              </div>
            </div>

            <div className="pt-2 border-t">
              <SubtaskSection projectId={projectId} taskId={t.Id} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
