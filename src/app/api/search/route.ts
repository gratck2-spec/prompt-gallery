import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q")

    if (!q || q.trim() === "") {
      return NextResponse.json([])
    }

    const prompts = await prisma.prompt.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { promptText: { contains: q, mode: "insensitive" } },
          { tags: { has: q } },
        ],
      },
      include: {
        images: { take: 1, orderBy: { sortOrder: "asc" as const } },
        user: {
          select: { id: true, name: true, handle: true, avatar: true },
        },
      },
      take: 20,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(prompts)
  } catch (error) {
    console.error("Error searching prompts:", error)
    return NextResponse.json(
      { error: "Failed to search prompts" },
      { status: 500 }
    )
  }
}
