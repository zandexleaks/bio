# ImageBoard - Dark Gallery

A sleek, dark-themed image board application with Cloudflare R2 storage integration.

## Features

- 🌙 **Dark Theme**: Modern, sleek dark UI with purple accents
- 🔐 **Secure Uploads**: Key-based authentication for image uploads
- 📱 **Responsive Design**: Works perfectly on all device sizes
- 🖼️ **Image Gallery**: Grid-based gallery with hover effects and modal previews
- ☁️ **Cloud Storage**: Powered by Cloudflare R2 for fast, reliable storage
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and configure:

\`\`\`bash
# Cloudflare R2 Configuration
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-custom-domain.com

# Upload Authentication
UPLOAD_KEY=your-secret-upload-key-here
\`\`\`

### 2. Cloudflare R2 Setup

1. Create a Cloudflare R2 bucket
2. Generate API tokens with R2 permissions
3. Configure a custom domain for public access (optional but recommended)
4. Set up CORS policy for your bucket:

\`\`\`json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"]
  }
]
\`\`\`

### 3. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

## Usage

### Uploading Images

1. Click the "Upload Image" button in the header
2. Enter your upload key (set in environment variables)
3. Drag & drop or select an image file
4. Click "Upload Image" to upload to R2

### Viewing Images

- Browse the gallery on the main page
- Click any image to view it in full size
- All images are publicly viewable without authentication

## Security

- Upload key authentication prevents unauthorized uploads
- File type validation (JPEG, PNG, GIF, WebP only)
- File size limits (10MB maximum)
- Server-side validation for all uploads

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Storage**: Cloudflare R2
- **Authentication**: Key-based upload protection
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

## API Endpoints

- `POST /api/upload` - Upload new image (requires key)
- `GET /api/images` - List all uploaded images (public)

## File Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── upload/route.ts    # Image upload endpoint
│   │   └── images/route.ts    # Image listing endpoint
│   ├── layout.tsx             # Root layout with dark theme
│   ├── page.tsx               # Main gallery page
│   └── globals.css            # Dark theme styles
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── header.tsx             # App header with upload button
│   ├── image-gallery.tsx      # Main gallery component
│   ├── upload-modal.tsx       # Upload interface
│   └── key-info.tsx           # Authentication info
├── lib/
│   ├── r2-client.ts           # Cloudflare R2 configuration
│   └── auth.ts                # Upload key validation
└── types/
    └── image.ts               # TypeScript interfaces
\`\`\`

## Customization

### Changing Upload Key

Update the `UPLOAD_KEY` environment variable and restart the application.

### Modifying File Restrictions

Edit the validation logic in `app/api/upload/route.ts`:

- Change `allowedTypes` array for different file formats
- Modify `maxSize` for different size limits

### Styling

The app uses a custom dark theme defined in `app/globals.css`. Modify the CSS custom properties to change colors and styling.
