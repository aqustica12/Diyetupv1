const express = require('express');
const router = express.Router();

// Get all diet plans
router.get('/', async (req, res) => {
  try {
    const dietPlans = [
      {
        id: 1,
        clientName: 'Ahmet Yılmaz',
        title: 'Kilo Verme Planı',
        status: 'active',
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        clientName: 'Fatma Demir',
        title: 'Kas Yapma Planı',
        status: 'active',
        createdAt: '2024-01-20'
      }
    ];
    
    res.json(dietPlans);
  } catch (error) {
    res.status(500).json({ error: 'Diyet planları getirilemedi' });
  }
});

// Create diet plan
router.post('/', async (req, res) => {
  try {
    const { clientId, title, meals } = req.body;
    res.status(201).json({ message: 'Diyet planı oluşturuldu' });
  } catch (error) {
    res.status(500).json({ error: 'Diyet planı oluşturulamadı' });
  }
});

module.exports = router; 