const express = require('express');
const router = express.Router();

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = [
      {
        id: 1,
        clientName: 'Ahmet Yılmaz',
        date: '2024-01-25T10:00:00',
        status: 'confirmed',
        type: 'consultation'
      },
      {
        id: 2,
        clientName: 'Fatma Demir',
        date: '2024-01-26T14:30:00',
        status: 'pending',
        type: 'follow-up'
      }
    ];
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Randevular getirilemedi' });
  }
});

// Create appointment
router.post('/', async (req, res) => {
  try {
    const { clientId, date, type } = req.body;
    res.status(201).json({ message: 'Randevu oluşturuldu' });
  } catch (error) {
    res.status(500).json({ error: 'Randevu oluşturulamadı' });
  }
});

module.exports = router; 