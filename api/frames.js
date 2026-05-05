const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const framesPath = path.join(process.cwd(), 'data', 'frames.json');
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
  res.status(200).json(publicFrames);
};
