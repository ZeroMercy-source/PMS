// app/api/projects/[id]/route.ts
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const API_BASE_URL = process.env.API_BASE_URL
  if (!API_BASE_URL) {
    return new Response("API_BASE_URL is missing in .env.local", { status: 500 })
  }

  const res = await fetch(`${API_BASE_URL}/projects/${params.id}`, {
    method: "DELETE",
  })

  const text = await res.text().catch(() => "")

  return new Response(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "text/plain",
    },
  })
}
