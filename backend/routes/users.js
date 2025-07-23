const express = require('express');
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    // TODO: Database'den kullanıcıları getir
    const users = [
      { id: 1, name: 'Admin', email: 'admin@diyetup.com', role: 'admin' },
      { id: 2, name: 'Diyetisyen 1', email: 'diyetisyen1@diyetup.com', role: 'dietitian' }
    ];
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Kullanıcılar getirilemedi' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Database'den kullanıcı getir
    const user = { id: 1, name: 'Admin', email: 'admin@diyetup.com', role: 'admin' };
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Kullanıcı getirilemedi' });
  }
});

module.exports = router; 