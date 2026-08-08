const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '..', 'uploads');
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      cb(null, safeName);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const accepted = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!accepted.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, WEBP and PDF files are allowed.'));
    }
    cb(null, true);
  },
});

module.exports = () => {
  const router = express.Router();

  router.post('/upload-receipt', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Receipt file is required.' });
    }
    const fileUrl = `/api/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  router.use((err, req, res, next) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message || 'Receipt upload failed.' });
    }
    next();
  });

  router.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  return router;
};
