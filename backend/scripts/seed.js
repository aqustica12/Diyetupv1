const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://diyetup_user:password@localhost:5432/diyetup');

async function seed() {
  try {
    console.log('🌱 Seed data başlıyor...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database bağlantısı başarılı');
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('password', 10);
    await sequelize.query(`
      INSERT INTO users (name, email, password, role) 
      VALUES ('Admin', 'admin@diyetup.com', '${hashedPassword}', 'admin')
      ON CONFLICT (email) DO NOTHING;
    `);
    
    // Create sample clients
    await sequelize.query(`
      INSERT INTO clients (name, email, phone, measurements) 
      VALUES 
        ('Ahmet Yılmaz', 'ahmet@email.com', '0532 123 4567', '{"weight": 75, "height": 175, "bmi": 24.5}'),
        ('Fatma Demir', 'fatma@email.com', '0533 987 6543', '{"weight": 65, "height": 165, "bmi": 23.8}')
      ON CONFLICT DO NOTHING;
    `);
    
    // Create sample foods
    await sequelize.query(`
      INSERT INTO foods (name, calories, protein, carbs, fat, category) 
      VALUES 
        ('Tavuk Göğsü', 165, 31, 0, 3.6, 'protein'),
        ('Mercimek', 116, 9, 20, 0.4, 'legumes'),
        ('Pirinç', 130, 2.7, 28, 0.3, 'grains'),
        ('Brokoli', 34, 2.8, 7, 0.4, 'vegetables')
      ON CONFLICT DO NOTHING;
    `);
    
    // Create sample recipes
    await sequelize.query(`
      INSERT INTO recipes (title, ingredients, instructions, calories, prep_time, category) 
      VALUES 
        ('Mercimek Çorbası', '["mercimek", "soğan", "havuç"]', 'Mercimekleri yıkayın ve haşlayın...', 150, '30 min', 'soup'),
        ('Tavuk Izgara', '["tavuk göğsü", "zeytinyağı", "baharatlar"]', 'Tavuk göğsünü marine edin...', 250, '45 min', 'main')
      ON CONFLICT DO NOTHING;
    `);
    
    console.log('✅ Seed data tamamlandı');
    
  } catch (error) {
    console.error('❌ Seed hatası:', error);
  } finally {
    await sequelize.close();
  }
}

seed(); 