# Fine Art Printing — New Dedicated Page

## Background

The "Fine Art Printing" service card on the homepage currently links to `bespoke-framing.html`. The user wants a **dedicated page** where customers can upload an image, choose a print paper/finish, optionally add a frame and mount, preview the result, and check out — all within the Dark Luxe Atelier aesthetic.

Inspiration drawn from [EasyFrame's Print & Frame](https://www.easyframe.co.uk/print-and-frame) configurator, which uses a tabbed step-by-step designer with live preview, paper selection, mount/frame options, and dynamic pricing.

---

## Proposed Flow — 5 Steps

| Step | Name | What the User Does |
|------|------|--------------------|
| **1** | **Upload & Size** | Upload photo, select print dimensions (Metric / Imperial / A sizes), crop to ratio |
| **2** | **Paper & Finish** | Choose paper type (Giclée Smooth, Giclée Textured, Photo Lustre, Photo Gloss), colour treatment (Original / B&W / Sepia), border options |
| **3** | **Frame & Mount** | *Optional* — add a frame and/or mount. Toggle "Print Only" vs "Print & Frame". If framing, select from the 100-frame catalogue + mount colours/widths |
| **4** | **Review & Pay** | Full order summary with live preview, line-item pricing, pay button |
| **✓** | **Success** | Confirmation screen with order details |

---

## User Review Required

> [!IMPORTANT]
> **Key decision — should this page reuse the existing "Frame My Photo" frame/mount/glass data (`data/frames.json`, `data/pricing.json`)?** This would keep pricing consistent and avoid data duplication. The plan below assumes **yes**.

> [!IMPORTANT]
> **Paper pricing** — I'll create a new `data/papers.json` with the 4 paper types and indicative pricing. You can adjust these values later.

---

## Open Questions

1. **Should "Print Only" (no frame) be the default path?** EasyFrame defaults to "Print & Frame" but allows print-only. I propose defaulting to **Print Only** with a clear toggle to add framing — this makes the page feel distinct from "Frame My Photo".

2. **Do you want a landing hero with service overview before the configurator?** I propose a compact hero (like Frame My Photo) + a "How It Works" strip showing the 3–4 steps visually before the tool begins.

3. **Stretched canvas prints** — should this be a paper/output option within this page, or a separate service? I propose including it as a 5th paper type: "Canvas Stretch" with its own pricing.

---

## Proposed Changes

### New Files

#### [NEW] `fine-art-printing.html`
The main page. Structure:
- Dark Luxe hero with breadcrumb, title "Fine Art **Printing**", subtitle
- Horizontal stepper (matching Frame My Photo style)
- **Step 1 panel**: Split layout — left: cropper, right: print size tabs (reuses exact same size data/UI from Frame My Photo)
- **Step 2 panel**: Split layout — left: live print preview on dark canvas, right: paper type cards (large visual cards with paper texture thumbnails, name, description, price uplift), colour treatment toggle (Original / B&W / Sepia), border options (Borderless / 10mm / 25mm white border)
- **Step 3 panel**: Toggle "Print Only / Print & Frame". If framing selected, reveals the frame grid + mount + glass options (reuses Frame My Photo components)
- **Step 4 panel**: Split layout — left: final preview, right: order summary card + pay button
- Success panel

#### [NEW] `css/fine-art-printing.css`
Page-specific styles following the Dark Luxe Atelier theme:
- Paper selection cards with large texture preview areas
- Colour treatment toggle (3 thumbnail previews showing Original/B&W/Sepia applied to the uploaded image)
- Border width visual preview
- "Print Only / Print & Frame" toggle switch
- All dark backgrounds, red accents, glowing hover states

#### [NEW] `js/fine-art-printing.js`
Page logic:
- Cropper.js integration (same as Frame My Photo)
- Print size selection with aspect ratio lock
- Paper selection state management
- Colour filter (B&W / Sepia via CSS filters on the preview canvas)
- Conditional frame/mount step (hidden when "Print Only")
- Dynamic pricing engine
- Stripe checkout integration (same pattern as Frame My Photo)

#### [NEW] `data/papers.json`
```json
[
  {
    "id": "giclee-smooth",
    "name": "Giclée Smooth",
    "description": "Ultra-smooth 310gsm cotton rag. Museum-quality archival finish with exceptional colour depth.",
    "price": 12.00,
    "pricePerSqM": 45.00,
    "thumbnail": "smooth"
  },
  {
    "id": "giclee-textured",
    "name": "Giclée Textured",
    "description": "Textured 300gsm cotton rag with a subtle canvas-like surface. Ideal for fine art reproductions.",
    "price": 14.00,
    "pricePerSqM": 52.00,
    "thumbnail": "textured"
  },
  {
    "id": "photo-lustre",
    "name": "Photo Lustre",
    "description": "Semi-gloss 260gsm photo paper. Vibrant colours with reduced glare — the photographer's choice.",
    "price": 8.00,
    "pricePerSqM": 30.00,
    "thumbnail": "lustre"
  },
  {
    "id": "photo-gloss",
    "name": "Photo Gloss",
    "description": "High-gloss 250gsm photo paper. Maximum colour saturation and sharpness.",
    "price": 7.00,
    "pricePerSqM": 25.00,
    "thumbnail": "gloss"
  },
  {
    "id": "canvas-stretch",
    "name": "Canvas Stretch",
    "description": "380gsm poly-cotton canvas, gallery-wrapped on solid pine stretcher bars. Ready to hang.",
    "price": 25.00,
    "pricePerSqM": 85.00,
    "thumbnail": "canvas"
  }
]
```

---

### Modified Files

#### [MODIFY] `index.html`
- Change the Fine Art Printing "Read More" link from `bespoke-framing.html` to `fine-art-printing.html`

#### [MODIFY] Footer navigation (all pages)
- Add "Fine Art Printing" link to the footer services list

---

## Step 2 — Paper & Finish (Key UI Detail)

This is the step that makes this page distinct from "Frame My Photo". The layout:

```
┌─────────────────────────────────┬──────────────────────────────────┐
│                                 │                                  │
│   LIVE PREVIEW                  │   PAPER TYPE                     │
│   (uploaded image with          │   ┌──────────┐ ┌──────────┐     │
│    selected paper texture       │   │ Giclée   │ │ Giclée   │     │
│    overlay + colour filter      │   │ Smooth   │ │ Textured │     │
│    + border simulation)         │   │ £12.00   │ │ £14.00   │     │
│                                 │   └──────────┘ └──────────┘     │
│                                 │   ┌──────────┐ ┌──────────┐     │
│   Running Total: £XX.XX         │   │ Photo    │ │ Photo    │     │
│                                 │   │ Lustre   │ │ Gloss    │     │
│                                 │   │ £8.00    │ │ £7.00    │     │
│                                 │   └──────────┘ └──────────┘     │
│                                 │                                  │
│                                 │   COLOUR TREATMENT               │
│                                 │   [Original] [B&W] [Sepia]      │
│                                 │                                  │
│                                 │   BORDER                         │
│                                 │   [Borderless] [10mm] [25mm]    │
│                                 │                                  │
│                                 │   [Back]            [Next →]    │
└─────────────────────────────────┴──────────────────────────────────┘
```

---

## Verification Plan

### Automated Tests
- Open `fine-art-printing.html` in browser
- Upload a test image → verify cropper loads
- Select paper type → verify pricing updates
- Toggle B&W / Sepia → verify preview filter applies
- Toggle "Print & Frame" → verify frame grid appears
- Complete checkout flow → verify summary card shows all selections

### Manual Verification
- Visual check across all 4 steps for Dark Luxe consistency
- Mobile responsiveness at 375px / 768px / 1024px
- Cross-check pricing calculations
