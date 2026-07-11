const pricing = require('./_data/pricing.json');

module.exports = (req, res) => {
  res.status(200).json(pricing);
};
