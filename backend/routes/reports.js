const express = require('express');
const router = express.Router();

// Get reports
router.get('/', async (req, res) => {
  try {
    const reports = [
      {
        id: 1,
        title: 'Ocak 2024 Raporu',
        type: 'monthly',
        createdAt: '2024-01-31'
      },
      {
        id: 2,
        title: 'Müşteri İstatistikleri',
        type: 'analytics',
        createdAt: '2024-01-25'
      }
    ];
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Raporlar getirilemedi' });
  }
});

module.exports = router; 