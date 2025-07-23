const express = require('express');
const router = express.Router();

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = [
      {
        id: 1,
        title: 'Mercimek Çorbası',
        category: 'soup',
        calories: 150,
        prepTime: '30 min'
      },
      {
        id: 2,
        title: 'Tavuk Izgara',
        category: 'main',
        calories: 250,
        prepTime: '45 min'
      }
    ];
    
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Tarifler getirilemedi' });
  }
});

// Create recipe
router.post('/', async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    res.status(201).json({ message: 'Tarif oluşturuldu' });
  } catch (error) {
    res.status(500).json({ error: 'Tarif oluşturulamadı' });
  }
});

module.exports = router; 