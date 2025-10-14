const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;


const frontendDir = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDir));


app.get(/^\/(?!api).*$/, (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});