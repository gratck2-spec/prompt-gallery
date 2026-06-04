import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MasonryGrid } from "@/components/masonry-grid"
import { PromptCard } from "@/components/prompt-card"
import { UserFollowButton } from "./user-follow-button"

interface Props {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const user = await prisma.user.findUnique({
    where: { handle },
    select: { name: true, bio: true },
  })

  if (!user) {
    return { title: "User Not Found" }
  }

  return {
    title: `${user.name} (@${handle}) | PromptGallery`,
    description: user.bio ?? `View ${user.name}'s prompts on PromptGallery`,
  }
}

export default async function UserProfilePage({ params }: Props) {
  const { handle } = await params
  const session = await getServerSession(authOptions)

  const user = await prisma.user.findUnique({
    where: { handle },
    include: {
      prompts: {
        include: {
          images: { take: 1, orderBy: { sortOrder: "asc" as const } },
          user: { select: { id: true, name: true, handle: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" as const },
      },
      _count: { select: { prompts: true, followers: true, following: true } },
    },
  })

  if (!user) {
    notFound()
  }

  const isFollowing = session?.user?.id
    ? await prisma.follow.findFirst({
        where: {
          followerId: session.user.id,
          followingId: user.id,
        },
      }).then((f) => !!f)
    : false

  const items = user.prompts.map((prompt) => ({
    id: prompt.id,
    content: <PromptCard prompt={prompt} />,
  }))

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col items-center gap-4 mb-8">
        <Avatar className="size-24">
          <AvatarImage src={user.avatar ?? undefined} alt={user.name ?? ""} />
          <AvatarFallback className="text-2xl">
            {user.name?.charAt(0)?.toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>

        <div className="text-center">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">@{user.handle}</p>
          {user.bio && <p className="mt-2 max-w-md">{user.bio}</p>}
        </div>

        <div className="flex gap-6 text-center">
          <div>
            <p className="text-2xl font-bold">{user._count.prompts}</p>
            <p className="text-sm text-muted-foreground">Prompts</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{user._count.followers}</p>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{user._count.following}</p>
            <p className="text-sm text-muted-foreground">Following</p>
          </div>
        </div>

        {session?.user?.id && session.user.id !== user.id && (
          <UserFollowButton handle={handle} initialFollowing={isFollowing} />
        )}
      </div>

      <MasonryGrid items={items} />
    </div>
  )
}
