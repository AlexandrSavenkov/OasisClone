import { type NextRequest, NextResponse } from "next/server"

const BASE_URL = "https://oasisdirect.ae/api/en"
const API_VERSION = "v=b2c3eQE7EgB9KeYP-kRG2"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") // 's' for category, 'b' for brand
  const name = searchParams.get("name") // category or brand name

  if (!type || !name) {
    return NextResponse.json({ error: "Missing type or name parameter" }, { status: 400 })
  }

  try {
    const url = `${BASE_URL}/${type}/${name}?${API_VERSION}`
    console.log("[v0] Proxy fetching from:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; OasisClone/1.0)",
      },
    })

    if (!response.ok) {
      console.log("[v0] External API error:", response.status, response.statusText)
      return NextResponse.json({ error: `External API error: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    console.log("[v0] Proxy received data, returning to client")

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Proxy error:", error)
    return NextResponse.json({ error: "Failed to fetch from external API" }, { status: 500 })
  }
}
