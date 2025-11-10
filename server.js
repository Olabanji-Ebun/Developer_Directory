import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'developers.json');

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const ensureDataFile = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
};

const readDevelopers = () => {
  ensureDataFile();
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
};

const writeDevelopers = (developers) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(developers, null, 2));
};

app.get('/developers', (req, res) => {
  const developers = readDevelopers();
  res.json(developers.reverse());
});

app.post('/developers', (req, res) => {
  const { name, role, tech_stack, experience } = req.body;

  if (!name || !role || !tech_stack || experience === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!['Frontend', 'Backend', 'Full-Stack'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  if (experience < 0) {
    return res.status(400).json({ error: 'Experience must be 0 or greater' });
  }

  const developers = readDevelopers();
  const newDeveloper = {
    id: Date.now().toString(),
    name,
    role,
    tech_stack,
    experience,
    created_at: new Date().toISOString(),
  };

  developers.push(newDeveloper);
  writeDevelopers(developers);

  res.status(201).json(newDeveloper);
});

app.listen(PORT, () => {
  console.log(`Developer Directory API running on http://localhost:${PORT}`);
});
