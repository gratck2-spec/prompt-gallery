import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, promptText, model, tags, images } = body as {
      title: string
      promptText: string
      model: string
      tags: string[]
      images: Array<{ url: string; alt?: string }>
    }

    if (!title || !promptText || !model) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const prompt = await prisma.prompt.create({
      data: {
        title,
        promptText,
        model,
        tags: tags ?? [],
        userId: session.user.id,
        images: {
          create: (images ?? []).map((img, index) => ({
            url: img.url,
            alt: img.alt,
            sortOrder: index,
          })),
        },
      },
      include: {
        images: true,
      },
    })

    return NextResponse.json(prompt, { status: 201 })
  } catch (error) {
    console.error("Error creating prompt:", error)
    return NextResponse.json(
      { error: "Failed to create prompt" },
      { status: 500 }
    )
  }
}
