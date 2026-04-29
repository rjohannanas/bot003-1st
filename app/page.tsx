"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Spinner } from "@/components/ui/spinner"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  console.log("[v0] HomePage render - loading:", loading, "user:", !!user)

  useEffect(() => {
    console.log("[v0] HomePage useEffect - loading:", loading, "user:", !!user)
    if (!loading) {
      if (user) {
        console.log("[v0] Redirecting to /chat")
        router.replace("/chat")
      } else {
        console.log("[v0] Redirecting to /login")
        router.replace("/login")
      }
    }
  }, [user, loading, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="size-8" />
    </div>
  )
}
