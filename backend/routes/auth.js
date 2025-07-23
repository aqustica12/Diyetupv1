const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // TODO: Database'den kullanıcı kontrolü
    // Şimdilik mock data
    const mockUser = {
      id: 1,
      email: 'admin@diyetup.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      name: 'Admin',
      role: 'admin'
    };

    if (email !== mockUser.email) {
      return res.status(401).json({ error: 'Geçersiz email veya şifre' });
    }

    const isValidPassword = await bcrypt.compare(password, mockUser.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Geçersiz email veya şifre' });
    }

    const token = jwt.sign(
      { userId: mockUser.id, email: mockUser.email, role: mockUser.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Giriş yapılırken hata oluştu' });
  }
});

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').isLength({ min: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    // TODO: Database'e kullanıcı kaydetme
    const hashedPassword = await bcrypt.hash(password, 10);

    res.status(201).json({ 
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: { email, name }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Kayıt olurken hata oluştu' });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token gerekli' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    res.json({ valid: true, user: decoded });

  } catch (error) {
    res.status(401).json({ error: 'Geçersiz token' });
  }
});

module.exports = router; 