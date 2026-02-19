const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3003;

// Block access to private folder
app.use('/private', (req, res) => {
  res.status(403).send('Access Forbidden');
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  AIJI Website is running.\n`);
  console.log(`  Open in your browser:\n`);
  console.log(`    http://localhost:${PORT}`);
  console.log(`    http://127.0.0.1:${PORT}\n`);
});

server.on('error', (err) => {
  if (err.code === 'EPERM' || err.code === 'EACCES') {
    console.error(`\n⚠️  Permission denied on port ${PORT}.`);
    console.error(`This might be a macOS security restriction.`);
    console.error(`\nTry one of these solutions:`);
    console.error(`1. Run manually: cd ${__dirname} && node server.js`);
    console.error(`2. Use a different port: PORT=5000 node server.js`);
    console.error(`3. Check System Settings > Network > Firewall`);
  } else if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️  Port ${PORT} is already in use.`);
    console.error(`Try: PORT=5000 node server.js`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

