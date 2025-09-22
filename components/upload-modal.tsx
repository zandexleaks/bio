"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Upload, X, ImageIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface UploadModalProps {
  onUploadSuccess?: () => void
}

export function UploadModal({ onUploadSuccess }: UploadModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [uploadKey, setUploadKey] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
      "video/*": [".mp4", ".webm"],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const handleUpload = async () => {
    if (!selectedFile || !uploadKey.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a file and enter your upload key.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("key", uploadKey)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const result = await response.json()

      toast({
        title: "Upload Successful",
        description: `${selectedFile.name} has been uploaded successfully.`,
      })

      // Reset form
      setSelectedFile(null)
      setUploadKey("")
      setIsOpen(false)
      onUploadSuccess?.()
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An error occurred during upload.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Upload className="w-4 h-4 mr-2" />
          Upload Media
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Upload New Media</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Key Input */}
          <div className="space-y-2">
            <Label htmlFor="upload-key" className="text-card-foreground">
              Upload Key
            </Label>
            <Input
              id="upload-key"
              type="password"
              placeholder="Enter your upload key"
              value={uploadKey}
              onChange={(e) => setUploadKey(e.target.value)}
              className="bg-input border-border text-foreground"
              disabled={isUploading}
            />
          </div>

          {/* File Drop Zone */}
          <div className="space-y-2">
            <Label className="text-card-foreground">Media File</Label>
            {!selectedFile ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <input {...getInputProps()} />
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-card-foreground mb-2">
                  {isDragActive ? "Drop the file here" : "Drag & drop a file here"}
                </p>
                <p className="text-sm text-muted-foreground">or click to select (Images & Videos - max 50MB)</p>
              </div>
            ) : (
              <div className="border border-border rounded-lg p-4 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ImageIcon className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-card-foreground font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    disabled={isUploading}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <Label className="text-card-foreground">Upload Progress</Label>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">{uploadProgress}% uploaded</p>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !uploadKey.trim() || isUploading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isUploading ? "Uploading..." : "Upload Media"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
