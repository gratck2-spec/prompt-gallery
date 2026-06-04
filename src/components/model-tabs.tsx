"use client"

import { Clock, TrendingUp, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

const MODELS = [
  { value: "all", label: "All" },
  { value: "gpt-image", label: "GPT Image" },
  { value: "gemini", label: "Gemini" },
  { value: "midjourney", label: "Midjourney" },
  { value: "seedance", label: "Seedance" },
  { value: "other", label: "Other" },
]

const SORTS = [
  { value: "newest", label: "Newest", icon: Clock },
  { value: "popular", label: "Popular", icon: Heart },
  { value: "trending", label: "Trending", icon: TrendingUp },
]

interface ModelTabsProps {
  activeModel: string
  activeSort: string
  onModelChange: (model: string) => void
  onSortChange: (sort: string) => void
}

export function ModelTabs({
  activeModel,
  activeSort,
  onModelChange,
  onSortChange,
}: ModelTabsProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="flex flex-wrap gap-2">
        {MODELS.map((model) => (
          <Button
            key={model.value}
            variant={activeModel === model.value ? "default" : "outline"}
            size="sm"
            onClick={() => onModelChange(model.value)}
          >
            {model.label}
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        {SORTS.map((sort) => (
          <Button
            key={sort.value}
            variant={activeSort === sort.value ? "default" : "ghost"}
            size="sm"
            onClick={() => onSortChange(sort.value)}
            className="gap-1"
          >
            <sort.icon className="size-3.5" />
            {sort.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
