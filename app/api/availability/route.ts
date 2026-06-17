import { getMeetingType } from "@/lib/booking/config"
import { getAvailability } from "@/lib/booking/availability"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = getMeetingType(searchParams.get("type") ?? "intro")
  if (!type) {
    return Response.json({ error: "Unknown meeting type" }, { status: 400 })
  }

  try {
    const result = await getAvailability(type)
    return Response.json(result)
  } catch (err) {
    console.error("availability error:", err)
    return Response.json(
      { error: "Could not load availability." },
      { status: 500 },
    )
  }
}
