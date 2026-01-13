"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DeleteProjectButton from "./DeleteProjectButton"
import EditProjectButton from "./EditProjectButton"

type Project = {
  Id: number
  Title: string
  Description: string
  IsDeleted: boolean
  DeletedAt: string | null
  Status: string
  Priority: string
  UserId: number
}

function normalizeProject(p: any): Project {
  return {
    Id: p?.Id ?? p?.id ?? 0,
    Title: p?.Title ?? p?.title ?? "No Title",
    Description: p?.Description ?? p?.description ?? "No Description",
    IsDeleted: p?.IsDeleted ?? p?.isDeleted ?? false,
    DeletedAt: p?.DeletedAt ?? p?.deletedAt ?? null,
    Status: String(p?.Status ?? p?.status ?? "ToDO"),
    Priority: String(p?.Priority ?? p?.priority ?? "Medium"),
    UserId: p?.UserId ?? p?.userId ?? 0,
  }
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function load() {
    try {
      setError("")
      setLoading(true)

      const res = await fetch("/api/projects", { cache: "no-store" })
      const text = await res.text().catch(() => "")

      if (!res.ok) {
        throw new Error(text || `HTTP ${res.status}`)
      }

      const raw = text ? JSON.parse(text) : []
      const arr = Array.isArray(raw) ? raw : [raw]

      setProjects(arr.map(normalizeProject))
    } catch (e: any) {
      setError(e?.message ?? "Failed to load projects")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  load()

  function onChanged() {
    load()
  }

  window.addEventListener("projects:changed", onChanged)
  return () => window.removeEventListener("projects:changed", onChanged)
}, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading projects...</CardTitle>
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
          <CardTitle>Couldn&apos;t load projects</CardTitle>
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

  const active = projects.filter((p) => !p.IsDeleted)

  if (!active.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No projects yet</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Click <span className="font-medium text-foreground">New Project</span>{" "}
          to create your first one.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {active.map((p) => (
        <Card key={p.Id} className="transition-all hover:shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-base leading-6">
                    <Link href={`/projects/${p.Id}`} className="hover:underline">
                    {p.Title}
                    </Link>
                </CardTitle>
              <Badge variant="secondary">{p.Status}</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {p.Description}
            </p>

            <div className="flex items-center justify-between">
              <Badge variant="outline">{p.Priority}</Badge>
              <div className="flex items-center gap-1">
                <EditProjectButton project={p} />
                <DeleteProjectButton id={p.Id} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
