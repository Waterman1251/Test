const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const uploadsDir = path.join(__dirname, 'public', 'uploads');
const videoDataFile = path.join(__dirname, 'videos.json');

// Ensure folders and data file exist
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(videoDataFile)) fs.writeFileSync(videoDataFile, JSON.stringify([]));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Upload storage config
const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});
const upload = multer({ storage: storage });

// Get all videos
app.get('/videos', (req, res) => {
    const videos = JSON.parse(fs.readFileSync(videoDataFile));
    res.json(videos);
});

// Upload video
app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const videoInfo = {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        title: req.file.originalname,
        uploadedAt: new Date().toISOString()
    };

    const videos = JSON.parse(fs.readFileSync(videoDataFile));
    videos.push(videoInfo);
    fs.writeFileSync(videoDataFile, JSON.stringify(videos, null, 2));

    res.json({ success: true, videoInfo });
});

// Serve uploaded videos
app.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(uploadsDir, req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ success: false, message: 'Video not found.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 SkipTube running at http://localhost:${PORT}`);
});
