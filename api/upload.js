module.exports = (req, res) => {
  // File uploads are not supported on Vercel's serverless (read-only filesystem).
  // For production, integrate a cloud storage service (e.g., Cloudinary, AWS S3).
  // The configurator handles image previews client-side, so this endpoint
  // returns a placeholder response.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json({
    success: true,
    message: 'Client-side preview is active. Server upload is not available in this deployment.',
    file: {
      filename: 'client-preview',
      originalName: 'client-preview',
      size: 0,
      url: ''
    }
  });
};
