import { prisma } from "@/lib/prisma"
import { PromptCard } from "@/components/prompt-card"
import { MasonryGrid } from "@/components/masonry-grid"
import { AdBanner } from "@/components/ad-banner"
import { HomepageFilters } from "./homepage-filters"

interface HomePageProps {
  searchParams: Promise<{ model?: string; sort?: string }>
}

const MODEL_MAP: Record<string, string> = {
  "gpt-image": "GPT Image",
  gemini: "Gemini",
  midjourney: "Midjourney",
  seedance: "Seedance",
  other: "Other",
}

export default async function Home({ searchParams }: HomePageProps) {
  const { model, sort } = await searchParams

  const where: Record<string, unknown> = {}
  if (model && model !== "all" && MODEL_MAP[model]) {
    where.model = MODEL_MAP[model]
  }

  const orderBy =
    sort === "popular"
      ? { likesCount: "desc" as const }
      : sort === "trending"
        ? { viewsCount: "desc" as const }
        : { createdAt: "desc" as const }

  const prompts = await prisma.prompt.findMany({
    where,
    orderBy,
    include: {
      images: { take: 1, orderBy: { sortOrder: "asc" as const } },
      user: { select: { id: true, name: true, handle: true, avatar: true } },
    },
    take: 50,
  })

  const items = prompts.map((prompt) => ({
    id: prompt.id,
    content: <PromptCard prompt={prompt} />,
  }))

  return (
    <div className="p-4">
      <HomepageFilters activeModel={model ?? "all"} activeSort={sort ?? "newest"} />
      <MasonryGrid items={items} />
      <AdBanner />
    </div>
  )
}
