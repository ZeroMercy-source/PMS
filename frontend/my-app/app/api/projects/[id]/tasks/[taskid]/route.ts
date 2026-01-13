export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; taskId: string } }
) {
  const API_BASE_URL = process.env.API_BASE_URL
  if (!API_BASE_URL) {
    return new Response("API_BASE_URL is missing in .env.local", { status: 500 })
  }

  const projectId = params.id
  const taskId = params.taskId

  const res = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
    method: "DELETE",
  })

  if (res.status === 204) return new Response(null, { status: 204 })

  const text = await res.text().catch(() => "")
  return new Response(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "text/plain" },
  })
}
