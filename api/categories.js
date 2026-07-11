const frames = require('./_data/frames.json');

module.exports = (req, res) => {
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
