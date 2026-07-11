const papers = require('./_data/papers.json');

module.exports = (req, res) => {
  res.status(200).json(papers);
};
