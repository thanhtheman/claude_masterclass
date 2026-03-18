"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/useUser"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/heists")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <main className="public">
        <div className="center-content">
          <p>Loading…</p>
        </div>
      </main>
    )
  }

  return (
    <main className="public">
      {children}
    </main>
  )
}
