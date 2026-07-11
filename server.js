// server.js — Earl's Picture Framing Backend
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());

// Extensionless URL fallback — resolve /page to /page.html
// Prevents 404s caused by cached browser redirects stripping .html
app.use((req, res, next) => {
    if (req.method === 'GET' && !path.extname(req.path) && !req.path.startsWith('/api/') && req.path !== '/') {
        const htmlPath = path.join(__dirname, req.path + '.html');
        // Containment check: a crafted path (e.g. encoded traversal) must never
        // resolve outside the site root before we sendFile it.
        const resolved = path.resolve(htmlPath);
        if (resolved.startsWith(__dirname + path.sep) && fs.existsSync(resolved)) {
            return res.sendFile(resolved);
        }
    }
    next();
});

// In production (Vercel) the /api directory is served only as serverless
// functions, never as static files. Mirror that here so the dev server can't
// leak handler source (/api/*.js) or the private catalogue (/api/_data/*.json).
// The JSON API routes below are extensionless, so blocking pathed files is safe.
app.use((req, res, next) => {
    if (req.path.startsWith('/api/') && path.extname(req.path)) {
        return res.status(404).json({ error: 'Not found' });
    }
    next();
});

app.use(express.static(__dirname)); // Serve all static files (HTML, CSS, JS, assets)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// --- Multer Config for File Uploads ---
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `photo-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, PNG, and WEBP files are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 200 * 1024 * 1024 } // 200MB
});

// --- API Routes ---

// Upload photo
app.post('/api/upload', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    }
    res.json({
        success: true,
        file: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            url: `/uploads/${req.file.filename}`
        }
    });
});

// Helper to resolve the correct moulding image filename dynamically (handles both .jpg and .png)
const mouldingsDir = path.join(__dirname, 'configurator', 'public', 'mouldings');
let mouldingFiles = [];
try {
    if (fs.existsSync(mouldingsDir)) {
        mouldingFiles = fs.readdirSync(mouldingsDir);
    }
} catch (e) {
    console.error('Error reading mouldings directory:', e);
}

function getMouldingImage(simonsCode) {
    if (!simonsCode) return null;
    const normalized = simonsCode.replace(/\//g, '_');
    const matched = mouldingFiles.find(file => {
        const nameWithoutExt = path.parse(file).name;
        return nameWithoutExt === normalized;
    });
    if (matched) {
        return `/configurator/public/mouldings/${matched}`;
    }
    return null;
}

// Get frames catalog (public — strips internal fields)
app.get('/api/frames', (req, res) => {
    const framesPath = path.join(__dirname, 'api', '_data', 'frames.json');
    let frames = JSON.parse(fs.readFileSync(framesPath, 'utf-8'));

    // Filter by category
    if (req.query.category) {
        frames = frames.filter(f => f.category === req.query.category);
    }

    // Search by name/description/tags
    if (req.query.search) {
        const q = req.query.search.toLowerCase();
        frames = frames.filter(f =>
            (f.name && f.name.toLowerCase().includes(q)) ||
            (f.description && f.description.toLowerCase().includes(q)) ||
            (f.tags && f.tags.some(t => t.includes(q)))
        );
    }

    // Strip internal fields (cost price AND supplier code) but still use the
    // supplier code to resolve the moulding image before dropping it.
    const publicFrames = frames.map(({ costPricePerMetre, simonsCode, ...rest }) => {
        const image = getMouldingImage(simonsCode);
        return { ...rest, image };
    });
    res.json(publicFrames);
});

// Get product categories with counts and price ranges
app.get('/api/categories', (req, res) => {
    const framesPath = path.join(__dirname, 'api', '_data', 'frames.json');
    const frames = JSON.parse(fs.readFileSync(framesPath, 'utf-8'));
    const cats = {};
    frames.forEach(f => {
        if (!f.category) return;
        if (!cats[f.category]) cats[f.category] = { name: f.category, count: 0, priceRange: { min: Infinity, max: 0 } };
        cats[f.category].count++;
        const price = f.retailPricePerMetre || 0;
        cats[f.category].priceRange.min = Math.min(cats[f.category].priceRange.min, price);
        cats[f.category].priceRange.max = Math.max(cats[f.category].priceRange.max, price);
    });
    res.json(Object.values(cats));
});

// Get pricing config
app.get('/api/pricing', (req, res) => {
    const pricingPath = path.join(__dirname, 'api', '_data', 'pricing.json');
    const pricing = JSON.parse(fs.readFileSync(pricingPath, 'utf-8'));
    res.json(pricing);
});

// Get papers catalog
app.get('/api/papers', (req, res) => {
    const papersPath = path.join(__dirname, 'api', '_data', 'papers.json');
    const papers = JSON.parse(fs.readFileSync(papersPath, 'utf-8'));
    res.json(papers);
});

// Create Stripe Checkout Session — delegate to the production handler so the
// dev server uses the exact same authoritative, server-side pricing engine
// (client-supplied prices are ignored) instead of a divergent copy.
app.post('/api/create-checkout', require('./api/create-checkout'));

// Multer error handling
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 200MB.' });
        }
        return res.status(400).json({ error: err.message });
    }
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    next();
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`\n  🖼️  Earl's Picture Framing Server`);
    console.log(`  ──────────────────────────────────`);
    console.log(`  Local:   http://localhost:${PORT}`);
    console.log(`  Frame:   http://localhost:${PORT}/frame-my-photo.html\n`);
});
