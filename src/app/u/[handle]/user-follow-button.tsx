"use client"

import { useState } from "react"
import { FollowButton } from "@/components/follow-button"
import { toast } from "sonner"

interface UserFollowButtonProps {
  handle: string
  initialFollowing: boolean
}

export function UserFollowButton({ handle, initialFollowing }: UserFollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/users/${handle}/follow`, { method: "POST" })
      if (!res.ok) throw new Error("Failed to toggle follow")
      const data = await res.json()
      setIsFollowing(data.following)
    } catch {
      toast.error("Failed to follow user")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FollowButton
      isFollowing={isFollowing}
      onToggle={handleToggle}
      isLoading={isLoading}
    />
  )
}
