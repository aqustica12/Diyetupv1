const express = require('express');
const router = express.Router();

// Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = [
      {
        id: 1,
        clientName: 'Ahmet Yılmaz',
        message: 'Diyet planımı güncelleyebilir misiniz?',
        status: 'unread',
        createdAt: '2024-01-25T10:30:00'
      },
      {
        id: 2,
        clientName: 'Fatma Demir',
        message: 'Randevu talebim var',
        status: 'read',
        createdAt: '2024-01-24T15:20:00'
      }
    ];
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Mesajlar getirilemedi' });
  }
});

module.exports = router; 