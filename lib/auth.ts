export function validateUploadKey(key: string): boolean {
  return key === process.env.UPLOAD_KEY
}

export function generateImageId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}
