const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const pricingPath = path.join(process.cwd(), 'data', 'pricing.json');
  const pricing = JSON.parse(fs.readFileSync(pricingPath, 'utf-8'));
  res.status(200).json(pricing);
};
