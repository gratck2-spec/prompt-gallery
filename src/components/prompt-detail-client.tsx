"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Eye, Copy, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { FollowButton } from "@/components/follow-button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface PromptDetailClientProps {
  prompt: {
    id: string
    title: string
    promptText: string
    model: string
    tags: string[]
    likesCount: number
    viewsCount: number
    images: Array<{ url: string; alt?: string | null; thumbnailUrl?: string | null }>
    user: {
      id: string
      name: string | null
      handle: string
      avatar: string | null
    }
  }
  isLiked: boolean
  currentUserId?: string
}

export function PromptDetailClient({ prompt, isLiked: initialIsLiked, currentUserId }: PromptDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [liked, setLiked] = useState(initialIsLiked)
  const [likesCount, setLikesCount] = useState(prompt.likesCount)
  const [isLiking, setIsLiking] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)

  const handleLike = async () => {
    if (!currentUserId) {
      toast.error("Please sign in to like prompts")
      return
    }
    if (isLiking) return
    setIsLiking(true)

    try {
      const res = await fetch(`/api/prompts/${prompt.id}/like`, { method: "POST" })
      if (!res.ok) throw new Error("Failed to toggle like")
      const data = await res.json()
      setLiked(data.liked)
      setLikesCount(data.likesCount)
    } catch {
      toast.error("Failed to like prompt")
    } finally {
      setIsLiking(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.promptText)
      setCopied(true)
      toast.success("Prompt copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy prompt")
    }
  }

  const handleFollowToggle = async (following: boolean) => {
    if (!currentUserId) {
      toast.error("Please sign in to follow users")
      return
    }
    setIsFollowLoading(true)
    try {
      const res = await fetch(`/api/users/${prompt.user.handle}/follow`, { method: "POST" })
      if (!res.ok) throw new Error("Failed to toggle follow")
      const data = await res.json()
      setIsFollowing(data.following)
    } catch {
      toast.error("Failed to follow user")
    } finally {
      setIsFollowLoading(false)
    }
  }

  const mainImage = prompt.images[selectedImageIndex]

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            {mainImage ? (
              <Image
                src={mainImage.url}
                alt={mainImage.alt ?? prompt.title}
                fill
                className="object-contain"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No image
              </div>
            )}
          </div>
          {prompt.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {prompt.images.map((image, index) => (
                <button
                  key={image.url}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                    index === selectedImageIndex
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={image.thumbnailUrl ?? image.url}
                    alt={image.alt ?? `Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Prompt</h2>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1">
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <pre className="whitespace-pre-wrap break-words font-mono text-sm bg-muted p-4 rounded-lg max-h-[500px] overflow-y-auto">
            {prompt.promptText}
          </pre>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{prompt.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="size-4" />
              {prompt.viewsCount} views
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link href={`/u/${prompt.user.handle}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Avatar>
              <AvatarImage src={prompt.user.avatar ?? undefined} alt={prompt.user.name ?? ""} />
              <AvatarFallback>
                {prompt.user.name?.charAt(0)?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{prompt.user.name}</p>
              <p className="text-sm text-muted-foreground">@{prompt.user.handle}</p>
            </div>
          </Link>
          {currentUserId && currentUserId !== prompt.user.id && (
            <FollowButton
              isFollowing={isFollowing}
              onToggle={handleFollowToggle}
              isLoading={isFollowLoading}
            />
          )}
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">Model</p>
            <Badge>{prompt.model}</Badge>
          </div>
          {prompt.tags.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          variant={liked ? "default" : "outline"}
          size="lg"
          className="w-full gap-2"
          onClick={handleLike}
          disabled={isLiking}
        >
          <Heart className={cn("size-5", liked && "fill-current")} />
          {liked ? "Liked" : "Like"} · {likesCount}
        </Button>
      </div>
    </div>
  )
}
