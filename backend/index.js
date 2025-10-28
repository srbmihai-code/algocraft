const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Enable CORS only for development
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
}

const frontendDir = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDir));

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username, password });
  res.json({ success: true, message: 'Login received' });
});

app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  console.log('Signup attempt:', { username, password });
  res.json({ success: true, message: 'Signup received' });
});

app.get(/^\/(?!api).*$/, (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
