"""
Fix BETA-3, R-1, BPR-5 by rendering pages instead of extracting embedded images.
Run: python3 scripts/fix-extraction-v2.py
"""
import fitz
from PIL import Image
import io, os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_IMAGES = os.path.join(BASE_DIR, 'public', 'images')
PDF_DIR = '/Users/williamvalverde/Downloads/Psicotécnico'

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)
    return path

def save_png(img, path):
    if img.mode in ('RGBA', 'LA', 'P', 'CMYK'):
        img = img.convert('RGB')
    img.save(path, 'PNG')

def render_page_cropped(doc, page_idx, dpi=200, crop_margins=True):
    """Render a page and optionally crop white margins."""
    mat = fitz.Matrix(dpi/72, dpi/72)
    pix = doc[page_idx].get_pixmap(matrix=mat)
    img = Image.open(io.BytesIO(pix.tobytes("png")))

    if crop_margins and img.mode == 'RGB':
        # Auto-crop white borders
        from PIL import ImageChops
        bg = Image.new(img.mode, img.size, (255, 255, 255))
        diff = ImageChops.difference(img, bg)
        bbox = diff.getbbox()
        if bbox:
            # Add small padding
            pad = 10
            bbox = (max(0, bbox[0]-pad), max(0, bbox[1]-pad),
                    min(img.width, bbox[2]+pad), min(img.height, bbox[3]+pad))
            img = img.crop(bbox)
    return img

def resize_max(img, max_dim=500):
    ratio = min(max_dim / img.width, max_dim / img.height)
    if ratio < 1:
        img = img.resize((int(img.width * ratio), int(img.height * ratio)), Image.LANCZOS)
    return img

def is_question_page(doc, page_idx, skip_keywords=None):
    """Check if a page is a question page (not gabarito, index, intro)."""
    text = doc[page_idx].get_text()[:300].upper()
    default_skip = ['GABARITO', 'ÍNDICE', 'INDICE', 'PREFÁCIO', 'PREFACIO']
    skip = (skip_keywords or []) + default_skip
    return not any(kw in text for kw in skip)

# ─── BETA-3: Render question pages ───
def fix_beta3():
    print("\n=== BETA-3 (page rendering) ===")
    doc = fitz.open(os.path.join(PDF_DIR, 'Testes de Raciocínio.pdf'))
    out_dir = ensure_dir(os.path.join(PUBLIC_IMAGES, 'beta3'))

    # BETA-3: pages 25-68. First find actual question pages.
    # Question pages have images OR significant vector content
    extracted = 0
    for p in range(24, 68):
        if extracted >= 15:
            break
        if not is_question_page(doc, p, ['BETA-III', 'OBJETIVO', 'DESCRIÇÃO']):
            continue

        # Check if page has meaningful content (images or drawings)
        page = doc[p]
        imgs = page.get_images(full=True)
        drawings = page.get_drawings()
        text = page.get_text().strip()

        # Skip pages that are mostly text instructions
        if len(text) > 500 and not imgs and not drawings:
            continue
        # Skip near-empty pages
        if not text and not imgs and not drawings:
            continue

        # Render the page
        img = render_page_cropped(doc, p, dpi=200)
        if img.width < 100 or img.height < 100:
            continue

        extracted += 1
        img = resize_max(img, 500)
        fname = f'beta3-{str(extracted).zfill(2)}.png'
        save_png(img, os.path.join(out_dir, fname))
        print(f"  {fname}: {img.size[0]}x{img.size[1]} (page {p+1})")

    print(f"  Extracted {extracted}/15")
    doc.close()

# ─── R-1: Render question pages ───
def fix_r1():
    print("\n=== R-1 (page rendering) ===")
    doc = fitz.open(os.path.join(PDF_DIR, 'Testes de Raciocínio.pdf'))
    out_dir = ensure_dir(os.path.join(PUBLIC_IMAGES, 'r1'))

    extracted = 0
    for p in range(464, min(549, doc.page_count)):
        if extracted >= 15:
            break
        if not is_question_page(doc, p, ['TESTE R-1', 'FORMA B', 'OBJETIVO']):
            continue

        page = doc[p]
        imgs = page.get_images(full=True)
        text = page.get_text().strip()

        # Skip text-heavy instruction pages
        if len(text) > 500 and not imgs:
            continue
        if not text and not imgs:
            continue

        # Check for meaningful images (not just separators)
        has_big_img = False
        for img_info in imgs:
            try:
                base = doc.extract_image(img_info[0])
                if base['width'] > 100 and base['height'] > 100:
                    has_big_img = True
                    break
            except:
                pass

        # Render page if it has drawings or meaningful images
        drawings = page.get_drawings()
        if has_big_img or len(drawings) > 5:
            img = render_page_cropped(doc, p, dpi=200)
            if img.width < 100 or img.height < 100:
                continue
            extracted += 1
            img = resize_max(img, 500)
            fname = f'r1-{str(extracted).zfill(2)}.png'
            save_png(img, os.path.join(out_dir, fname))
            print(f"  {fname}: {img.size[0]}x{img.size[1]} (page {p+1})")

    print(f"  Extracted {extracted}/15")
    doc.close()

# ─── BPR-5: Find and extract RA and RE sections ───
def fix_bpr5():
    print("\n=== BPR-5 RA & RE (page rendering) ===")
    doc = fitz.open(os.path.join(PDF_DIR, 'Testes de Raciocínio.pdf'))
    bpr5_ra_dir = ensure_dir(os.path.join(PUBLIC_IMAGES, 'bpr5ra'))
    bpr5_re_dir = ensure_dir(os.path.join(PUBLIC_IMAGES, 'bpr5re'))

    # Scan BPR-5 section to find subsections
    print("  Scanning BPR-5 section for subsections...")
    for p in range(199, 280):
        text = doc[p].get_text()[:200].strip()
        imgs = doc[p].get_images(full=True)
        drawings = doc[p].get_drawings()
        if text and (len(text) < 200 or imgs or len(drawings) > 5):
            short = text[:80].replace('\n', ' ')
            print(f"    P{p+1}: [{len(imgs)}img {len(drawings)}draw] {short}")

    # For BPR-5, just extract pages with substantial image content
    # The BPR-5 has abstract and spatial reasoning mixed together
    ra_count = 0
    re_count = 0

    for p in range(199, 280):
        if ra_count >= 20 and re_count >= 15:
            break

        page = doc[p]
        imgs = page.get_images(full=True)
        drawings = page.get_drawings()
        text = page.get_text()[:300].upper()

        if 'GABARITO' in text or 'BPR-5' in text[:20]:
            continue

        # Pages with images or many drawings are question pages
        has_content = False
        for img_info in imgs:
            try:
                base = doc.extract_image(img_info[0])
                if base['width'] > 100 and base['height'] > 100:
                    has_content = True
                    break
            except:
                pass

        if not has_content and len(drawings) < 10:
            continue

        # Render the page
        img = render_page_cropped(doc, p, dpi=200)
        if img.width < 100 or img.height < 100:
            continue

        img = resize_max(img, 500)

        # Assign to RA first, then RE
        if ra_count < 20:
            ra_count += 1
            fname = f'bpr5ra-{str(ra_count).zfill(2)}.png'
            save_png(img, os.path.join(bpr5_ra_dir, fname))
            print(f"  RA: {fname} (page {p+1})")
        elif re_count < 15:
            re_count += 1
            fname = f'bpr5re-{str(re_count).zfill(2)}.png'
            save_png(img, os.path.join(bpr5_re_dir, fname))
            print(f"  RE: {fname} (page {p+1})")

    print(f"  RA: {ra_count}/20, RE: {re_count}/15")
    doc.close()

if __name__ == '__main__':
    fix_beta3()
    fix_r1()
    fix_bpr5()

    # Count
    total = 0
    for root, dirs, files in os.walk(PUBLIC_IMAGES):
        for f in files:
            if f.endswith(('.png', '.jpg', '.jpeg', '.webp')):
                total += 1
    print(f"\nTotal images: {total}")
