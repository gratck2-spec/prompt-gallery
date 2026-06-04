"use client"

import { Button } from "@/components/ui/button"

interface FollowButtonProps {
  isFollowing: boolean
  onToggle: (following: boolean) => void
  isLoading?: boolean
}

export function FollowButton({ isFollowing, onToggle, isLoading }: FollowButtonProps) {
  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      onClick={() => onToggle(!isFollowing)}
      disabled={isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </Button>
  )
}
