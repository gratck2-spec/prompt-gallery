import type { Metadata } from "next"
import { Sparkles, Share2, Search, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "About | PromptGallery",
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About PromptGallery</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The community-driven platform for discovering, sharing, and remixing AI prompts
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <div className="p-6 rounded-xl border bg-card">
          <Sparkles className="size-10 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Discover Prompts</h3>
          <p className="text-muted-foreground">
            Browse thousands of AI prompts for GPT Image, Gemini, Midjourney, Seedance, and more.
            Find inspiration for your next creative project.
          </p>
        </div>

        <div className="p-6 rounded-xl border bg-card">
          <Share2 className="size-10 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Share Your Work</h3>
          <p className="text-muted-foreground">
            Publish your best prompts and share them with the community. Showcase your prompt
            engineering skills and help others learn.
          </p>
        </div>

        <div className="p-6 rounded-xl border bg-card">
          <Search className="size-10 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Search & Filter</h3>
          <p className="text-muted-foreground">
            Find exactly what you need with powerful search and filtering. Browse by model,
            popularity, or trending prompts.
          </p>
        </div>

        <div className="p-6 rounded-xl border bg-card">
          <Users className="size-10 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Join the Community</h3>
          <p className="text-muted-foreground">
            Follow your favorite prompt creators, like prompts you find useful, and connect
            with fellow AI enthusiasts.
          </p>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          PromptGallery is built to be the go-to resource for AI prompt engineering. We believe that
          great prompts unlock the full potential of AI models, and sharing knowledge benefits everyone
          in the community.
        </p>
      </div>
    </div>
  )
}
