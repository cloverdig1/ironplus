const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const rootDir = path.join(__dirname, '..');
const dbPath = path.join(__dirname, 'db', 'ironplus.sqlite');
const schemaPath = path.join(__dirname, 'db', 'schema.sql');

fs.mkdirSync(path.join(__dirname, 'db'), { recursive: true });

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Unable to open database', err);
    process.exit(1);
  }
});

const schema = fs.readFileSync(schemaPath, 'utf8');
db.serialize(() => {
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(schema, (err) => {
    if (err) {
      console.error('Failed to initialize database schema', err);
      process.exit(1);
    }
  });
});

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:4000'];

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use('/api', apiLimiter);
app.use('/src', express.static(path.join(rootDir, 'src')));
app.use('/public', express.static(path.join(rootDir, 'public')));
app.use('/admin', express.static(path.join(rootDir, 'admin')));

const apiRouter = require('./routes')(db);
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(rootDir, 'index.html'));
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Iron Plus Gym backend running on http://localhost:${port}`);
});
