export async function GET(req: Request) {
  const API_BASE_URL = process.env.API_BASE_URL
  if (!API_BASE_URL) {
    return new Response("API_BASE_URL is missing in .env.local", { status: 500 })
  }

  
  const url = new URL(req.url)
  const qs = url.searchParams.toString()
  const target = `${API_BASE_URL}/projects${qs ? `?${qs}` : ""}`

  const res = await fetch(target, { cache: "no-store" })

  const text = await res.text().catch(() => "")
  return new Response(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  })
}

export async function POST(req: Request) {
  const API_BASE_URL = process.env.API_BASE_URL
  if (!API_BASE_URL) {
    return new Response("API_BASE_URL is missing in .env.local", { status: 500 })
  }

  const body = await req.json()

  const res = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const text = await res.text().catch(() => "")
  return new Response(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  })
}
