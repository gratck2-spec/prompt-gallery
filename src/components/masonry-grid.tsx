import { cn } from "@/lib/utils"
import Link from "next/link"
import { ImageIcon, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MasonryGridItem {
  id: string
  content: React.ReactNode
}

interface MasonryGridProps {
  items: MasonryGridItem[]
  columns?: number
  className?: string
}

export function MasonryGrid({ items, columns, className }: MasonryGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <ImageIcon className="h-8 w-8 text-muted-foreground/60" />
        </div>
        <h3 className="text-lg font-medium mb-2">No prompts yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          Be the first to share your AI prompt with the community.
        </p>
        <Link href="/publish">
          <Button variant="default" size="sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Publish your first prompt
          </Button>
        </Link>
      </div>
    )
  }

  const columnClass = columns
    ? undefined
    : "columns-2 sm:columns-3 lg:columns-4"

  const columnStyle = columns
    ? { columnCount: String(columns) }
    : undefined

  return (
    <div
      className={cn(
        "gap-4",
        columnClass,
        className
      )}
      style={columnStyle}
    >
      {items.map((item) => (
        <div key={item.id} className="break-inside-avoid mb-4">
          {item.content}
        </div>
      ))}
    </div>
  )
}
