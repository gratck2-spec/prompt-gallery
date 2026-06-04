import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: promptId } = await params
    const userId = session.user.id

    const existingLike = await prisma.like.findFirst({
      where: { userId, promptId },
    })

    if (existingLike) {
      await prisma.$transaction([
        prisma.like.delete({ where: { id: existingLike.id } }),
        prisma.prompt.update({
          where: { id: promptId },
          data: { likesCount: { decrement: 1 } },
        }),
      ])

      const prompt = await prisma.prompt.findUnique({
        where: { id: promptId },
        select: { likesCount: true },
      })

      return NextResponse.json({ liked: false, likesCount: prompt?.likesCount ?? 0 })
    }

    await prisma.$transaction([
      prisma.like.create({ data: { userId, promptId } }),
      prisma.prompt.update({
        where: { id: promptId },
        data: { likesCount: { increment: 1 } },
      }),
    ])

    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
      select: { likesCount: true },
    })

    return NextResponse.json({ liked: true, likesCount: prompt?.likesCount ?? 0 })
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    )
  }
}
