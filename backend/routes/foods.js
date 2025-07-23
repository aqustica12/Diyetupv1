const express = require('express');
const router = express.Router();

// Get all foods
router.get('/', async (req, res) => {
  try {
    const foods = [
      {
        id: 1,
        name: 'Tavuk Göğsü',
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        category: 'protein'
      },
      {
        id: 2,
        name: 'Mercimek',
        calories: 116,
        protein: 9,
        carbs: 20,
        fat: 0.4,
        category: 'legumes'
      }
    ];
    
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: 'Besinler getirilemedi' });
  }
});

module.exports = router; 