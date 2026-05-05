// server.js — Earl's Picture Framing Backend
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());

// Extensionless URL fallback — resolve /page to /page.html
// Prevents 404s caused by cached browser redirects stripping .html
app.use((req, res, next) => {
    if (req.method === 'GET' && !path.extname(req.path) && !req.path.startsWith('/api/') && req.path !== '/') {
        const htmlPath = path.join(__dirname, req.path + '.html');
        if (fs.existsSync(htmlPath)) {
            return res.sendFile(htmlPath);
        }
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

// Get frames catalog (public — strips internal fields)
app.get('/api/frames', (req, res) => {
    const framesPath = path.join(__dirname, 'data', 'frames.json');
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

    // Strip internal fields (cost price, supplier code)
    const publicFrames = frames.map(({ costPricePerMetre, simonsCode, ...rest }) => rest);
    res.json(publicFrames);
});

// Get product categories with counts and price ranges
app.get('/api/categories', (req, res) => {
    const framesPath = path.join(__dirname, 'data', 'frames.json');
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
    const pricingPath = path.join(__dirname, 'data', 'pricing.json');
    const pricing = JSON.parse(fs.readFileSync(pricingPath, 'utf-8'));
    res.json(pricing);
});

// Get papers catalog
app.get('/api/papers', (req, res) => {
    const papersPath = path.join(__dirname, 'data', 'papers.json');
    const papers = JSON.parse(fs.readFileSync(papersPath, 'utf-8'));
    res.json(papers);
});

// Create Stripe Checkout Session
app.post('/api/create-checkout', async (req, res) => {
    try {
        const { items, customerEmail, orderSummary } = req.body;

        const lineItems = items.map(item => ({
            price_data: {
                currency: 'gbp',
                product_data: {
                    name: item.name,
                    description: item.description || ''
                },
                unit_amount: Math.round(item.price * 100) // Stripe expects pence
            },
            quantity: 1
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            customer_email: customerEmail || undefined,
            success_url: `${req.protocol}://${req.get('host')}/frame-my-photo.html?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/frame-my-photo.html?payment=cancelled`,
            metadata: {
                order_summary: JSON.stringify(orderSummary).substring(0, 500)
            }
        });

        res.json({ sessionId: session.id, url: session.url });
    } catch (err) {
        console.error('Stripe error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

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
    console.log(`  Frame:   http://localhost:${PORT}/frame-my-photo.html`);
    console.log(`  Print:   http://localhost:${PORT}/fine-art-printing.html\n`);
});
