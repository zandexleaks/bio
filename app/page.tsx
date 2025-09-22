"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ImageGallery } from "@/components/image-gallery"
import { Toaster } from "@/components/ui/toaster"

export default function HomePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  useEffect(() => {
    // Fire-and-forget request to log the page visit.
    // We don't need to handle the response or errors here,
    // as it's a background task.
    fetch("/api/s")
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header onUploadSuccess={handleUploadSuccess} />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Media Gallery
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Browse our collection of uploaded images and videos. Click on any
            item to view it in full size.
          </p>
        </div>

        <ImageGallery refreshTrigger={refreshTrigger} />
      </main>

      <Toaster />
    </div>
  )
}
