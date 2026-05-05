const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const framesPath = path.join(process.cwd(), 'data', 'frames.json');
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
  res.status(200).json(Object.values(cats));
};
