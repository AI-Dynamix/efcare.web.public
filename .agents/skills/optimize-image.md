# Skill: Optimize Image for Web (→ WebP)

Convert and optimize any image to WebP format before adding to the website.

## Usage

```
/optimize-image <input-path> [output-name] [max-width]
```

## What it does

1. Loads source image (PNG/JPG/JPEG/BMP)
2. Strips metadata (EXIF)
3. Resizes to max-width preserving aspect ratio (default: 1600px)
4. Converts to WebP at quality 85
5. Saves to `public/images/<output-name>.webp`
6. Prints file size comparison

## Python script (run manually or via agent)

```python
from PIL import Image
import os, sys

def optimize(src, dest_name=None, max_width=1600, quality=85):
    src = os.path.abspath(src)
    img = Image.open(src).convert('RGB')

    # Resize if wider than max_width
    if img.width > max_width:
        ratio = max_width / img.width
        img = img.resize((max_width, int(img.height * ratio)), Image.LANCZOS)

    out_dir = r'D:\aidx\code\efcare\efcare.web.public\public\images'
    os.makedirs(out_dir, exist_ok=True)

    if not dest_name:
        dest_name = os.path.splitext(os.path.basename(src))[0]

    out_path = os.path.join(out_dir, dest_name + '.webp')
    img.save(out_path, 'WEBP', quality=quality, method=6)

    src_size  = os.path.getsize(src) / 1024
    dest_size = os.path.getsize(out_path) / 1024
    print(f'Input:  {src_size:.0f} KB ({Image.open(src).size})')
    print(f'Output: {dest_size:.0f} KB ({img.size}) → {out_path}')
    print(f'Saved:  {100*(1-dest_size/src_size):.0f}%')
    return out_path

if __name__ == '__main__':
    optimize(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None,
             int(sys.argv[3]) if len(sys.argv) > 3 else 1600)
```

## AstroWind usage

After optimizing, reference in components:

```astro
<img src="/images/hero.webp" alt="..." width="1200" height="800" loading="eager" />
```

Or use Astro's Image component for further optimization.
