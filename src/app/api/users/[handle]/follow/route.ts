import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { handle } = await params
    const followerId = session.user.id

    const targetUser = await prisma.user.findUnique({
      where: { handle },
      select: { id: true },
    })

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (targetUser.id === followerId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      )
    }

    const existingFollow = await prisma.follow.findFirst({
      where: { followerId, followingId: targetUser.id },
    })

    if (existingFollow) {
      await prisma.follow.delete({ where: { id: existingFollow.id } })
      return NextResponse.json({ following: false })
    }

    await prisma.follow.create({
      data: { followerId, followingId: targetUser.id },
    })

    return NextResponse.json({ following: true })
  } catch (error) {
    console.error("Error toggling follow:", error)
    return NextResponse.json(
      { error: "Failed to toggle follow" },
      { status: 500 }
    )
  }
}
