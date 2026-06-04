"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ModelTabs } from "@/components/model-tabs"

interface HomepageFiltersProps {
  activeModel: string
  activeSort: string
}

export function HomepageFilters({ activeModel, activeSort }: HomepageFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleModelChange = (model: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("model", model)
    router.push(`/?${params.toString()}`)
  }

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", sort)
    router.push(`/?${params.toString()}`)
  }

  return (
    <ModelTabs
      activeModel={activeModel}
      activeSort={activeSort}
      onModelChange={handleModelChange}
      onSortChange={handleSortChange}
    />
  )
}
