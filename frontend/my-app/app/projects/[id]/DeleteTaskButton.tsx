"use client"

import { useState } from "react"

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

      location.reload()
    } catch (e: any) {
      alert(e?.message ?? "Failed to delete task")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={del} disabled={loading}>
      {loading ? "Deleting..." : "Delete"}
    </button>
  )
}
