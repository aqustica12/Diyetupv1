const express = require('express');
const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    // TODO: Database'den müşterileri getir
    const clients = [
      { 
        id: 1, 
        name: 'Ahmet Yılmaz', 
        email: 'ahmet@email.com',
        phone: '0532 123 4567',
        status: 'active',
        createdAt: '2024-01-15'
      },
      { 
        id: 2, 
        name: 'Fatma Demir', 
        email: 'fatma@email.com',
        phone: '0533 987 6543',
        status: 'active',
        createdAt: '2024-01-20'
      }
    ];
    
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Müşteriler getirilemedi' });
  }
});

// Get client by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Database'den müşteri getir
    const client = {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet@email.com',
      phone: '0532 123 4567',
      status: 'active',
      measurements: {
        weight: 75,
        height: 175,
        bmi: 24.5
      },
      createdAt: '2024-01-15'
    };
    
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Müşteri getirilemedi' });
  }
});

// Create new client
router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    // TODO: Database'e müşteri kaydet
    
    res.status(201).json({ 
      message: 'Müşteri başarıyla oluşturuldu',
      client: { name, email, phone }
    });
  } catch (error) {
    res.status(500).json({ error: 'Müşteri oluşturulamadı' });
  }
});

module.exports = router; 