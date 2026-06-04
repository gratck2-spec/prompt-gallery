import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@promptgallery.ai" },
    update: {},
    create: {
      email: "admin@promptgallery.ai",
      name: "Admin",
      handle: "admin",
      bio: "PromptGallery Admin",
    },
  })

  const prompts = [
    {
      title: "Cinematic Portrait Photography",
      promptText: "A cinematic portrait of a young woman with golden hour lighting, shot on 85mm lens, shallow depth of field, film grain, warm color grading, professional photography",
      model: "GPT Image",
      tags: ["portrait", "cinematic", "photography"],
    },
    {
      title: "Abstract Digital Art",
      promptText: "Create an abstract digital artwork with flowing neon colors, geometric shapes, and particle effects. Style: futuristic, vibrant, high contrast, 4K resolution",
      model: "GPT Image",
      tags: ["abstract", "digital", "neon"],
    },
    {
      title: "Mountain Landscape at Dawn",
      promptText: "Majestic mountain landscape at dawn, misty valleys, golden sunlight breaking through clouds, snow-capped peaks, ultra wide angle, photorealistic, 8K detail",
      model: "Gemini",
      tags: ["landscape", "mountains", "nature"],
    },
    {
      title: "Cyberpunk City Street",
      promptText: "A cyberpunk city street at night with neon signs in Japanese, rain-soaked pavement reflecting lights, flying cars, holographic advertisements, blade runner style",
      model: "Gemini",
      tags: ["cyberpunk", "city", "futuristic"],
    },
    {
      title: "Fantasy Character Design",
      promptText: "Design a fantasy elven warrior character with ornate armor, magical glowing sword, forest background, dramatic lighting, concept art style, highly detailed",
      model: "Midjourney",
      tags: ["fantasy", "character", "concept-art"],
    },
    {
      title: "Watercolor Botanical Illustration",
      promptText: "Delicate watercolor botanical illustration of wildflowers and ferns, soft pastel colors, white background, scientific illustration style, detailed petals and leaves",
      model: "Midjourney",
      tags: ["watercolor", "botanical", "illustration"],
    },
    {
      title: "Animated Character Expression Sheet",
      promptText: "Create an expression sheet for a cute animated character showing 6 emotions: happy, sad, angry, surprised, scared, and neutral. Pixar style, clean lines",
      model: "Seedance",
      tags: ["animation", "character", "expressions"],
    },
    {
      title: "Dance Movement Sequence",
      promptText: "Generate a sequence of a ballet dancer performing a graceful arabesque, flowing dress, studio lighting, motion blur, artistic photography, elegant composition",
      model: "Seedance",
      tags: ["dance", "motion", "artistic"],
    },
    {
      title: "Minimalist Logo Design",
      promptText: "Design a minimalist logo for a tech startup called NovaSphere, geometric shapes, gradient from blue to purple, clean lines, scalable vector style, white background",
      model: "Other",
      tags: ["logo", "minimalist", "branding"],
    },
    {
      title: "Vintage Poster Art",
      promptText: "Create a vintage travel poster for Tokyo featuring cherry blossoms, Mount Fuji, and traditional architecture, retro color palette, art deco style, bold typography",
      model: "Other",
      tags: ["vintage", "poster", "travel"],
    },
  ]

  for (const promptData of prompts) {
    await prisma.prompt.create({
      data: {
        ...promptData,
        userId: admin.id,
        images: {
          create: [
            {
              url: `https://picsum.photos/seed/${promptData.title.replace(/\s+/g, "-")}/400/500`,
              alt: promptData.title,
              sortOrder: 0,
            },
          ],
        },
      },
    })
  }

  console.log("Seed data created successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
