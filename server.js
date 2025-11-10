const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'developers.json');

app.use(express.json());

// CORS middleware
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

// GET all developers
app.get('/developers', (req, res) => {
  const developers = readDevelopers();
  res.json(developers.reverse());
});

// POST new developer
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

// PUT update developer - ADD THIS ROUTE
app.put('/developers/:id', (req, res) => {
  const { id } = req.params;
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
  const developerIndex = developers.findIndex(dev => dev.id === id);

  if (developerIndex === -1) {
    return res.status(404).json({ error: 'Developer not found' });
  }

  // Update the developer but keep the original created_at
  developers[developerIndex] = {
    ...developers[developerIndex],
    name,
    role,
    tech_stack,
    experience
  };

  writeDevelopers(developers);
  res.json(developers[developerIndex]);
});

// DELETE developer - ADD THIS ROUTE
app.delete('/developers/:id', (req, res) => {
  const { id } = req.params;
  const developers = readDevelopers();
  const developerIndex = developers.findIndex(dev => dev.id === id);

  if (developerIndex === -1) {
    return res.status(404).json({ error: 'Developer not found' });
  }

  developers.splice(developerIndex, 1);
  writeDevelopers(developers);
  res.json({ message: 'Developer deleted successfully' });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Developer Directory API running on http://localhost:${PORT}`);
});