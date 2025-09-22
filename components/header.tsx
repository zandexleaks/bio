"use client"

import { UploadModal } from "./upload-modal"

interface HeaderProps {
  onUploadSuccess?: () => void
}

export function Header({ onUploadSuccess }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">/comincel</h1>
          <p className="text-sm text-muted-foreground">Dark Gallery</p>
        </div>

        <UploadModal onUploadSuccess={onUploadSuccess} />
      </div>
    </header>
  )
}
