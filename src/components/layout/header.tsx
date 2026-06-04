"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Search, Plus, LogOut, User } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">PromptGallery</span>
        </Link>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search prompts..."
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-2">
          <Link href="/publish" className={buttonVariants({ variant: "outline", size: "sm" }) + " gap-1"}>
            <Plus className="h-4 w-4" />
            Publish
          </Link>

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center rounded-full p-0.5 hover:bg-accent transition-colors cursor-pointer">
                <Avatar size="sm">
                  <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? ""} />
                  <AvatarFallback>
                    {session.user.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => window.location.href = "/profile"}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" onClick={() => signIn()}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
