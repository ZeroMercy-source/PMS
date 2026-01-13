// app/api/projects/[id]/route.ts
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params

  const API_BASE_URL = process.env.API_BASE_URL
  if (!API_BASE_URL) {
    return new Response("API_BASE_URL is missing in .env.local", { status: 500 })
  }

  const url = `${API_BASE_URL}/projects/${id}`
  const res = await fetch(url, { method: "DELETE" })

  // 204 must not include a body
  if (res.status === 204) {
    return new Response(null, { status: 204 })
  }

  const text = await res.text().catch(() => "")
  return new Response(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "text/plain",
    },
  })
}


export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params

  const API_BASE_URL = process.env.API_BASE_URL
  if (!API_BASE_URL) {
    return new Response("API_BASE_URL is missing in .env.local", { status: 500 })
  }

  const body = await req.json()

  const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  // If backend returns 204, don't include a body
  if (res.status === 204) {
    return new Response(null, { status: 204 })
  }

  const text = await res.text().catch(() => "")
  return new Response(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "text/plain",
    },
  })
}
