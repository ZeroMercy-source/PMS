// app/api/projects/[id]/tasks/[taskId]/subtasks/route.ts
const API_BASE_URL = process.env.API_BASE_URL

function missingBaseUrl() {
  return new Response("API_BASE_URL is missing in .env.local", { status: 500 })
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  if (!API_BASE_URL) return missingBaseUrl()

  const { id, taskId } = await params

  const res = await fetch(`${API_BASE_URL}/projects/${id}/tasks/${taskId}/subtasks`, {
    cache: "no-store",
  })

  if (res.status === 204) return new Response(null, { status: 204 })

  const text = await res.text().catch(() => "")
  return new Response(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  })
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  if (!API_BASE_URL) return missingBaseUrl()

  const { id, taskId } = await params
  const body = await req.json()

  const res = await fetch(`${API_BASE_URL}/projects/${id}/tasks/${taskId}/subtasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (res.status === 204) return new Response(null, { status: 204 })

  const text = await res.text().catch(() => "")
  return new Response(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
  })
}
