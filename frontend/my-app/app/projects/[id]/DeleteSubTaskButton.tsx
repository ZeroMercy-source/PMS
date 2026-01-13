"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DeleteSubtaskButton({
  projectId,
  taskId,
  subtaskId,
}: {
  projectId: number
  taskId: number
  subtaskId: number
}) {
  const [loading, setLoading] = useState(false)

  async function del() {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}`,
        { method: "DELETE" }
      )

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `HTTP ${res.status}`)
      }

      window.dispatchEvent(new Event(`subtasks:changed:${taskId}`))
    } catch (e: any) {
      alert(e?.message ?? "Failed to delete subtask")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="destructive" size="sm" onClick={del} disabled={loading}>
      {loading ? "Deleting..." : "Delete"}
    </Button>
  )
}
