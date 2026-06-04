import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: "https://promptgallery.ai", lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: "https://promptgallery.ai/about", changeFrequency: "monthly" as const, priority: 0.5 },
    { url: "https://promptgallery.ai/privacy", changeFrequency: "monthly" as const, priority: 0.3 },
    { url: "https://promptgallery.ai/terms", changeFrequency: "monthly" as const, priority: 0.3 },
    { url: "https://promptgallery.ai/search", changeFrequency: "weekly" as const, priority: 0.7 },
  ]

  try {
    const { prisma } = await import("@/lib/prisma")

    const prompts = await prisma.prompt.findMany({
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 1000,
    })

    const users = await prisma.user.findMany({
      select: { handle: true, updatedAt: true },
      take: 500,
    })

    return [
      ...staticPages,
      ...prompts.map((p) => ({
        url: `https://promptgallery.ai/prompt/${p.id}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...users.map((u) => ({
        url: `https://promptgallery.ai/u/${u.handle}`,
        lastModified: u.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ]
  } catch {
    return staticPages
  }
}
