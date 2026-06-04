import Link from "next/link"
import Image from "next/image"
import { Heart, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface PromptCardProps {
  prompt: {
    id: string
    title: string
    model: string
    likesCount: number
    viewsCount: number
    images: Array<{ url: string; alt?: string | null }>
    user: {
      name: string | null
      handle: string
      avatar: string | null
    }
  }
}

export function PromptCard({ prompt }: PromptCardProps) {
  const imageUrl = prompt.images[0]?.url

  return (
    <Link href={`/prompt/${prompt.id}`} className="block group">
      <Card className="overflow-hidden transition-transform duration-200 hover:scale-[1.02] cursor-pointer">
        <div className="relative aspect-[4/5] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={prompt.images[0]?.alt ?? prompt.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
          <Badge className="absolute top-2 left-2" variant="secondary">
            {prompt.model}
          </Badge>
        </div>
        <CardContent className="space-y-2">
          <h3 className="font-medium text-sm line-clamp-2 leading-snug">
            {prompt.title}
          </h3>
          <div className="flex items-center gap-2">
            <Avatar className="size-5">
              <AvatarImage src={prompt.user.avatar ?? undefined} alt={prompt.user.name ?? ""} />
              <AvatarFallback className="text-[10px]">
                {prompt.user.name?.charAt(0)?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              {prompt.user.name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="size-3" />
              {prompt.likesCount}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="size-3" />
              {prompt.viewsCount}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
