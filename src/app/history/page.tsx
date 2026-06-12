"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { History, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function HistoryPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="max-w-4xl mx-auto p-4" />
  }

  if (status === "unauthenticated") {
    redirect("/auth/signin")
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-3 mb-8">
        <History className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-bold">History</h1>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h2 className="text-lg font-medium mb-2">No history yet</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Prompts you have viewed will appear here. Start exploring prompts to build your history.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
