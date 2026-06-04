import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PromptDetailClient } from "@/components/prompt-detail-client"
import { AdBanner } from "@/components/ad-banner"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const prompt = await prisma.prompt.findUnique({
    where: { id },
    select: { title: true, promptText: true },
  })

  if (!prompt) {
    return { title: "Prompt Not Found" }
  }

  return {
    title: `${prompt.title} | PromptGallery`,
    description: prompt.promptText.slice(0, 160),
  }
}

export default async function PromptPage({ params }: Props) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  const prompt = await prisma.prompt.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      user: { select: { id: true, name: true, handle: true, avatar: true } },
      likes: true,
    },
  })

  if (!prompt) {
    notFound()
  }

  await prisma.prompt.update({
    where: { id },
    data: { viewsCount: { increment: 1 } },
  })

  const isLiked = session?.user?.id
    ? prompt.likes.some((like) => like.userId === session.user.id)
    : false

  return (
    <div className="max-w-4xl mx-auto p-4">
      <PromptDetailClient
        prompt={prompt}
        isLiked={isLiked}
        currentUserId={session?.user?.id}
      />
      <AdBanner />
    </div>
  )
}
