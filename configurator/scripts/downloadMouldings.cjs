const fs = require('fs');
const https = require('https');
const path = require('path');

const newDataPath = path.join(__dirname, '../src/newData.js');
const outDir = path.join(__dirname, '../public/frames');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

const content = fs.readFileSync(newDataPath, 'utf8');
const catMatch = content.match(/export const FRAME_CATALOGUE = \[([\s\S]*?)\];/);

if (!catMatch) {
    console.error("Could not find FRAME_CATALOGUE");
    process.exit(1);
}

const frames = [];
const rowRegex = /id:\s*'([^']+)',\s*code:\s*'([^']+)'/g;
let m;
while ((m = rowRegex.exec(catMatch[1])) !== null) {
    frames.push({ id: m[1], code: m[2] });
}

console.log(`Found ${frames.length} frames to download.`);

function fetchHtml(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchHtml(res.headers.location).then(resolve).catch(reject);
            }
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode !== 200) {
                file.close();
                fs.unlinkSync(dest);
                return reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlinkSync(dest);
            reject(err);
        });
    });
}

async function run() {
    let successCount = 0;
    let missingCount = 0;
    const missingCodes = [];

    for (let i = 0; i < frames.length; i++) {
        const { id, code } = frames[i];
        const dest = path.join(outDir, `${id}.jpg`);
        
        if (fs.existsSync(dest)) {
            console.log(`[${i+1}/${frames.length}] Skip ${id} (${code}), already exists`);
            successCount++;
            continue;
        }

        console.log(`[${i+1}/${frames.length}] Fetching ${code}...`);
        try {
            const searchUrl = `https://djsimons.co.uk/?s=${encodeURIComponent(code)}&post_type=product`;
            const html = await fetchHtml(searchUrl);
            
            // Find all jpg/png uploads
            const imgRegex = /https:\/\/djsimons\.co\.uk\/wp-content\/uploads\/[^\"]+\.(jpg|png)/ig;
            const matches = [...new Set(html.match(imgRegex) || [])];
            
            // Filter out thumbnails (-100x100, -300x300, etc) to find the main image
            const cleanMatches = matches.filter(url => !/-\d+x\d+\.(jpg|png)$/i.test(url));
            
            // Look for an image containing the sanitized code if possible, or just the first clean product image
            let targetImg = null;
            const safeCode = code.replace('/', '-');
            
            for (const url of cleanMatches) {
                if (url.includes(safeCode) && !url.includes('_w.')) {
                    targetImg = url;
                    break;
                }
            }
            
            if (!targetImg && cleanMatches.length > 0) {
                targetImg = cleanMatches.find(u => u.includes('products-'));
            }
            
            if (!targetImg && cleanMatches.length > 0) {
                targetImg = cleanMatches[0];
            }

            if (targetImg) {
                await downloadImage(targetImg, dest);
                console.log(`  -> Downloaded ${targetImg}`);
                successCount++;
            } else {
                console.log(`  -> No image found for ${code}`);
                missingCount++;
                missingCodes.push(code);
            }
        } catch (e) {
            console.error(`  -> Error fetching ${code}: ${e.message}`);
            missingCount++;
            missingCodes.push(code);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n--- SUMMARY ---');
    console.log(`Successfully downloaded: ${successCount}`);
    console.log(`Missing: ${missingCount}`);
    if (missingCodes.length > 0) {
        console.log('Missing codes:', missingCodes.join(', '));
    }
}

run();
