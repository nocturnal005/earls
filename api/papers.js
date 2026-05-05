const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const papersPath = path.join(process.cwd(), 'data', 'papers.json');
  const papers = JSON.parse(fs.readFileSync(papersPath, 'utf-8'));
  res.status(200).json(papers);
};
