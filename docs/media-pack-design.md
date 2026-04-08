# Server Media Pack Design

## Current State ("Slop")
- Servers can have a `banner` field (URL string)
- No upload mechanism
- No validation of image sizes/formats
- No multiple images support
- No icon/logo support beyond the server icon from query

## Proposed Media Pack System

### Media Types Per Server
1. **Banner** (Required) - Hero image on server detail page
   - Size: 1200x400px recommended
   - Max file size: 2MB
   - Formats: JPG, PNG, WebP
   
2. **Icon/Logo** (Optional) - Square logo for cards
   - Size: 256x256px recommended
   - Max file size: 500KB
   - Formats: PNG (transparent), JPG
   
3. **Screenshots** (Optional, up to 6) - Gallery on detail page
   - Size: 1920x1080px recommended
   - Max file size: 3MB each
   - Formats: JPG, PNG, WebP
   - Carousel/lightbox display

4. **Trailer/Video** (Optional) - YouTube embed
   - URL only (not uploaded)
   - Shows in lightbox/gallery

### Upload Flow
1. Server owner submits form
2. Media upload is separate step (optional but encouraged)
3. Images uploaded to Cloudflare R2 (S3-compatible storage)
4. URLs stored in `server_media` table linked to server_id

### API Endpoints
- `POST /api/servers/[id]/media` - Upload media
- `DELETE /api/servers/[id]/media/[media_id]` - Delete media
- `GET /api/servers/[id]/media` - List media

### Database Schema
```sql
CREATE TABLE server_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  type VARCHAR(20) CHECK (type IN ('banner', 'icon', 'screenshot')),
  url TEXT NOT NULL,
  thumbnail_url TEXT, -- For screenshots
  filename VARCHAR(255),
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(server_id, type) WHERE type IN ('banner', 'icon')
);
```

### Validation
- Image dimensions checked on upload
- File size limits enforced
- Virus/malware scanning (optional)
- NSFW content detection (optional)

### UI Components
1. **MediaUploadZone** - Drag & drop upload component
2. **MediaPreview** - Preview uploaded images with crop option
3. **ImageCropper** - Optional cropping tool
4. **MediaGallery** - Display screenshots on server page

### CDN Integration
- Cloudflare R2 for storage
- Images served via CDN with automatic optimization
- WebP conversion on-the-fly
- Responsive images with srcset

## Implementation Priority

### Phase 1: Basic Upload (MVP)
- [ ] Single banner upload on submit form
- [ ] Store in R2
- [ ] Display on server detail page

### Phase 2: Full Media Pack
- [ ] Icon/logo upload
- [ ] Screenshot gallery (up to 6)
- [ ] Media management in dashboard

### Phase 3: Polish
- [ ] Image cropping tool
- [ ] NSFW detection
- [ ] Auto-optimization

## Current Issues to Fix
1. Submit form has no media fields
2. ServerCard doesn't show banners consistently
3. No validation of external banner URLs
4. No fallback for broken images
