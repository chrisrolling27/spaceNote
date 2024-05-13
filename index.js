const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/clicked', (req, res) => {
    const spaceName = req.query.spaceName;
    console.log('Space clicked:', spaceName);
    res.json({ success: true, message: `Space ${spaceName} clicked` });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
