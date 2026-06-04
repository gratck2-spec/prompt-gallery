"use client"

import { useState, useEffect, useCallback } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { MasonryGrid } from "@/components/masonry-grid"
import { PromptCard } from "@/components/prompt-card"

interface Prompt {
  id: string
  title: string
  model: string
  likesCount: number
  viewsCount: number
  images: Array<{ url: string; alt?: string | null }>
  user: { name: string | null; handle: string; avatar: string | null }
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Prompt[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const searchPrompts = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      if (!res.ok) throw new Error("Search failed")
      const data = await res.json()
      setResults(data)
    } catch {
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      searchPrompts(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, searchPrompts])

  const items = results.map((prompt) => ({
    id: prompt.id,
    content: <PromptCard prompt={prompt} />,
  }))

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search prompts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          Searching...
        </div>
      )}

      {!isLoading && query && results.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No results found for &quot;{query}&quot;
        </div>
      )}

      {!isLoading && !query && (
        <div className="text-center py-12 text-muted-foreground">
          Enter a search term to find prompts
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <MasonryGrid items={items} />
      )}
    </div>
  )
}
