"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DeleteTaskButton({
  projectId,
  taskId,
}: {
  projectId: number
  taskId: number
}) {
  const [loading, setLoading] = useState(false)

  async function del() {
    if (projectId == null || taskId == null) {
      alert(`Missing ids: projectId=${projectId}, taskId=${taskId}`)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `HTTP ${res.status}`)
      }

      window.dispatchEvent(new Event("tasks:changed"))
      window.dispatchEvent(new Event("projects:changed"))
    } catch (e: any) {
      alert(e?.message ?? "Failed to delete task")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={del}
      disabled={loading}
    >
      {loading ? "Deleting..." : "Delete"}
    </Button>
  )
}
