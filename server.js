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

// DELETE route to remove a developer
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