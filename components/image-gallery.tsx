"use client"

import { useState, useEffect } from "react"
import type { ImageData } from "@/types/image"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader } from "@/components/loader"
import { ImageIcon, Calendar, HardDrive, PlayCircle, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ImageGalleryProps {
  refreshTrigger?: number
}

export function ImageGallery({ refreshTrigger }: ImageGalleryProps) {
  const [media, setMedia] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMedia = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/images")
      if (!response.ok) {
        throw new Error("Failed to fetch media")
      }
      const data = await response.json()
      setMedia(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [refreshTrigger, toast])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <Loader />
    )
  }

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ImageIcon className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-card-foreground mb-2">No Media Yet</h3>
        <p className="text-muted-foreground max-w-md">
          The gallery is empty. Upload your first image or video to get started!
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {media.map((item) => (
          <Dialog key={item.id}>
            <DialogTrigger asChild>
              <Card className="group aspect-square overflow-hidden cursor-pointer bg-card border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10">
                <div className="relative w-full h-full">
                  {item.contentType.startsWith("video/") ? (
                    <>
                      <video
                        src={item.url}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        loop
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-200">
                        <PlayCircle className="w-12 h-12 text-white/80 drop-shadow-lg" />
                      </div>
                    </>
                  ) : (
                    <img
                      src={item.url || "/placeholder.svg"}
                      alt={item.originalName}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-white text-sm font-medium truncate">{item.originalName}</p>
                    <p className="text-white/80 text-xs">{formatFileSize(item.size)}</p>
                  </div>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent
              className="w-screen h-screen bg-transparent border-none p-4 shadow-none flex items-center justify-center"
              ariaLabel={`View of ${item.originalName}`}
            >
              {/* The content is now directly inside the dialog for simpler centering */}
              {item.contentType.startsWith("video/") ? (
                <video
                  src={item.url}
                  className="max-w-full max-h-full object-contain"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={item.url || "/placeholder.svg"}
                  alt={item.originalName}
                  className="max-w-full max-h-full object-contain"
                />
              )}
              <DialogClose className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white/80 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </>
  )
}
