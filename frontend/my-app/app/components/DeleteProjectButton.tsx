"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DeleteProjectButton({ id }: { id: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function del() {
    setLoading(true)

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `HTTP ${res.status}`)
      }

      router.refresh()
      window.dispatchEvent(new Event("projects:changed"))
    } catch (e: any) {
      alert(e?.message ?? "Failed to delete")
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
