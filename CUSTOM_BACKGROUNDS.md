# Custom Backgrounds Guide

Your NoxShift scheduler now supports **custom image and video backgrounds**! 🎨🎥

## Quick Setup

### 1. Folder Structure
```
NoxShift/
└── public/
    └── backgrounds/        ← Created and ready!
        ├── background-1.jpg    ← Add your images here
        ├── background-2.png
        ├── background-3.mp4    ← Add your videos here
        └── background-4.webm
```

### 2. Add Your Files

**For Images:**
- Supported formats: JPG, PNG, GIF, WebP
- Recommended size: 1920x1080 or larger
- Name them: `background-1.jpg`, `background-2.png`, etc.

**For Videos:**
- Supported formats: MP4, WebM (MP4 recommended for best compatibility)
- Keep file size under 50MB for smooth playback
- Name them: `background-1.mp4`, `background-2.mp4`, etc.

### 3. Copy to Dev Server
```powershell
# After adding files to network location
robocopy "\\192.168.168.182\Folder Redirection\Ccooper\Desktop\NoxShift\public\backgrounds" "C:\NoxShift\public\backgrounds" /E
```

## Features

### 🖼️ Image Backgrounds
- **6 slots** for custom images
- Click to apply instantly
- Fixed position (doesn't scroll)
- Cover mode for full-screen effect
- Hover to see image name

### 🎬 Video Backgrounds
- **4 slots** for custom videos
- Autoplay on loop
- Fixed position for immersive effect
- Full-screen coverage with object-fit

### 🎮 Video Controls
**Play/Pause**: Control video playback
- Pause to save performance
- Resume anytime

**Sound Toggle**: Mute/Unmute video audio
- Starts muted (browser autoplay requirement)
- Toggle sound on/off

**Opacity Slider**: Adjust background visibility (20-100%)
- Lower opacity if text is hard to read
- Dynamically adjusts without reloading

**Clear Background**: Remove all backgrounds instantly

## Theme Gallery Organization

When you open Themes (🎨 Palette icon), you'll see:

1. **Theme Tabs** - Light/Dark/Creative themes
2. **Font Family** - 20 fonts to choose from
3. **Font Size** - Slider + quick presets
4. **Color Customizer** - 13 colors per theme
5. **Background Textures** - 10 built-in patterns
6. **Custom Image Backgrounds** ← NEW! Your images
7. **Custom Video Backgrounds** ← NEW! Your videos
8. **Background Controls** ← NEW! Video & opacity controls

## Naming Your Files

**Images (6 slots):**
- `background-1.jpg` → "Image 1"
- `background-2.jpg` → "Image 2"
- `background-3.png` → "Image 3"
- `background-4.png` → "Image 4"
- `background-5.png` → "Image 5"
- `background-6.png` → "Image 6"

**Videos (4 slots):**
- `background-1.mp4` → "Video 1"
- `background-2.mp4` → "Video 2"
- `background-3.mp4` → "Video 3"
- `background-4.webm` → "Video 4"

**Want more slots?** Let me know and I'll add more!

## Tips for Best Results

### Images
- Use high-resolution images (1920x1080 minimum)
- Dark or muted images work best for readability
- Consider images with interesting textures or patterns
- Avoid busy images that compete with schedule content

### Videos
- Keep videos under 30 seconds (they loop automatically)
- Use subtle motion (slow pans, gentle animations)
- Compress videos to reduce file size
- Test on target device for performance
- Consider abstract/ambient videos for best effect

### Performance
- Use videos sparingly on lower-end devices
- Pause video when not needed
- Lower opacity if schedule becomes hard to read
- Clear background to return to default theme

## Advanced Customization

Want to:
- Add more slots (10+ images, 10+ videos)?
- Create categories (Nature, Abstract, Minimal)?
- Add upload functionality directly in the app?
- Set different backgrounds per department?
- Schedule background changes (morning/evening themes)?

Just ask! The system is fully extensible. 🚀

## Troubleshooting

**Image doesn't show?**
- Check file exists in `public/backgrounds/`
- Verify filename matches exactly (case-sensitive)
- Try hard refresh (Ctrl+Shift+R)

**Video doesn't play?**
- Ensure video codec is H.264 (MP4) or VP8/VP9 (WebM)
- Check file size (large files = slow loading)
- Verify video isn't corrupted
- Try clicking Play button if it paused

**Text hard to read?**
- Use opacity slider (lower to 60-80%)
- Choose darker/lighter backgrounds
- Consider adding subtle overlay in the future

---

**Ready to use!** Just add your image and video files to the backgrounds folder. 🎉
