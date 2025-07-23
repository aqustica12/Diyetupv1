const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// PayTR ödeme başlatma - kullanıcıyı ödeme sayfasına yönlendir
router.post('/start', async (req, res) => {
  try {
    console.log('Ödeme başlatma isteği:', req.body);
    
    const { amount, package_id, package_name } = req.body;
    
    // PayTR bilgileri
    const merchant_id = process.env.PAYTR_MERCHANT_ID;
    const merchant_key = process.env.PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT;
    
    if (!merchant_id || !merchant_key || !merchant_salt) {
      return res.status(400).json({
        success: false,
        error: 'PayTR bilgileri eksik'
      });
    }
    
    // Benzersiz sipariş numarası
    const merchant_oid = 'DYT' + Date.now();
    const email = 'test@diyetup.com';
    const payment_amount = amount * 100; // Kuruş cinsinden
    
    // Ürün sepeti
    const basket = [
      [package_name, amount.toString(), 1]
    ];
    const user_basket = Buffer.from(JSON.stringify(basket)).toString('base64');
    
    // Kullanıcı bilgileri
    const user_ip = req.ip || '45.141.151.100'; // VPS IP'si
    const user_name = 'DiyetUp User';
    const user_address = 'Turkey';
    const user_phone = '5551234567';
    
    // URL'ler
    const merchant_ok_url = `${process.env.FRONTEND_URL || 'https://diyetup.com'}/payment/success`;
    const merchant_fail_url = `${process.env.FRONTEND_URL || 'https://diyetup.com'}/payment/error`;
    
    // PayTR ayarları
    const timeout_limit = 30;
    const debug_on = 1;
    const test_mode = 1; // Test modu (gerçek ödemeler için 0 yap)
    const no_installment = 0;
    const max_installment = 0;
    const currency = 'TL';
    const lang = 'tr';
    
    // Hash oluştur
    const hash_str = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`;
    const paytr_token = hash_str + merchant_salt;
    const token = crypto.createHmac('sha256', merchant_key).update(paytr_token).digest('base64');
    
    // PayTR'ye gönderilecek veriler
    const post_vals = {
      merchant_id: merchant_id,
      merchant_key: merchant_key,
      merchant_salt: merchant_salt,
      email: email,
      payment_amount: payment_amount,
      merchant_oid: merchant_oid,
      user_name: user_name,
      user_address: user_address,
      user_phone: user_phone,
      merchant_ok_url: merchant_ok_url,
      merchant_fail_url: merchant_fail_url,
      user_basket: user_basket,
      user_ip: user_ip,
      timeout_limit: timeout_limit,
      debug_on: debug_on,
      test_mode: test_mode,
      lang: lang,
      no_installment: no_installment,
      max_installment: max_installment,
      currency: currency,
      paytr_token: token
    };
    
    console.log('PayTR Token:', token);
    console.log('Merchant OID:', merchant_oid);
    console.log('Test Mode:', test_mode);
    
    // PayTR API'sine POST isteği gönder
    const fetch = (await import('node-fetch')).default;
    const params = new URLSearchParams(post_vals);
    
    const paytr_response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params
    });
    
    const paytr_data = await paytr_response.text();
    console.log('PayTR Response:', paytr_data);
    
    // PayTR'den gelen token'ı parse et
    if (paytr_data.startsWith('success:')) {
      const payment_token = paytr_data.split(':')[1];
      const payment_url = `https://www.paytr.com/odeme/guvenli/${payment_token}`;
      
      console.log('PayTR Success! Payment URL:', payment_url);
      
      res.json({
        success: true,
        payment_url: payment_url,
        merchant_oid: merchant_oid,
        token: payment_token
      });
    } else {
      console.error('PayTR Error:', paytr_data);
      res.status(400).json({
        success: false,
        error: 'PayTR ödeme token alınamadı: ' + paytr_data
      });
    }
    
  } catch (error) {
    console.error('Ödeme hatası:', error);
    res.status(500).json({
      success: false,
      error: 'Ödeme işlemi başlatılamadı'
    });
  }
});

// PayTR callback - ödeme sonucu
router.post('/callback', (req, res) => {
  console.log('PayTR Callback:', req.body);
  
  const {
    merchant_oid,
    status,
    total_amount,
    hash
  } = req.body;
  
  // Hash doğrulama
  const merchant_key = process.env.PAYTR_MERCHANT_KEY;
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT;
  
  const hash_str = `${merchant_oid}${merchant_salt}${status}${total_amount}`;
  const calculated_hash = crypto.createHmac('sha256', merchant_key).update(hash_str).digest('base64');
  
  if (hash !== calculated_hash) {
    console.error('Hash doğrulama hatası');
    return res.send('FAIL');
  }
  
  if (status === 'success') {
    console.log('Ödeme başarılı:', merchant_oid, total_amount);
    // Burada database'de ödeme durumunu güncelle
    // Kullanıcının aboneliğini aktif et
  } else {
    console.log('Ödeme başarısız:', merchant_oid);
  }
  
  res.send('OK');
});

module.exports = router; 