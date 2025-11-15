// Catch-all route to handle frontend pages
// In a real implementation, you might serve static files from the frontend directory
export default function handler(req, res) {
  // For now, redirect to the API index
  res.status(307).redirect('/api');
}