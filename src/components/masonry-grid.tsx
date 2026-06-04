import { cn } from "@/lib/utils"

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
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        No items
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
