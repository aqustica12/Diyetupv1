const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const microtime = require('microtime');

// PayTR callback
router.post('/callback', (req, res) => {
    const { merchant_oid, status, total_amount } = req.body;
    
    console.log('PayTR Callback:', { merchant_oid, status, total_amount });
    
    if (status === 'success') {
        // Database'de ödeme durumunu güncelle
        // Aboneliği aktif et
        console.log('Ödeme başarılı, abonelik aktif ediliyor...');
    } else {
        console.log('Ödeme başarısız');
    }
    
    res.send('OK');
});

// PayTR token oluştur
router.post('/create-token', (req, res) => {
    console.log('PayTR create-token çağrıldı');
    
    const { amount, user_id, package_id } = req.body;
    
    // Gerçek PayTR değerleri
    const merchant_id = process.env.PAYTR_MERCHANT_ID;
    const merchant_key = process.env.PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT;
    
    if (!merchant_id || !merchant_key || !merchant_salt) {
        return res.status(400).json({
            error: 'PayTR environment variables eksik',
            missing: {
                PAYTR_MERCHANT_ID: !merchant_id,
                PAYTR_MERCHANT_KEY: !merchant_key,
                PAYTR_MERCHANT_SALT: !merchant_salt
            }
        });
    }
    
    console.log('PayTR Config:', {
        merchant_id,
        merchant_key: merchant_key.substring(0, 10) + '...',
        merchant_salt: merchant_salt.substring(0, 10) + '...'
    });
    
    // PayTR örneğine göre düzeltilmiş kod
    const merchant_oid = "IN" + microtime.now(); // Sipariş numarası
    const email = 'test@diyetup.com';
    const payment_amount = amount * 100; // Kuruş cinsinden
    
    // PayTR örneğine göre basket formatı
    const basket = JSON.stringify([
        ['DiyetUp Paket', (payment_amount / 100).toString(), 1]
    ]);
    
    // Base64 encode (nodejs-base64-converter kullanılmalı ama şimdilik Buffer kullanıyoruz)
    const user_basket = Buffer.from(basket).toString('base64');
    
    const user_ip = '45.141.151.100'; // VPS IP'si
    const timeout_limit = 30;
    const debug_on = 1;
    const test_mode = 1; // Test modu
    const no_installment = 0;
    const max_installment = 0;
    const currency = "TL";
    const lang = "tr";
    const user_name = "DiyetUp User";
    const user_address = "Turkey";
    const user_phone = "5551234567";
    const merchant_ok_url = "https://diyetup.com/payment/success";
    const merchant_fail_url = "https://diyetup.com/payment/error";
    
    // PayTR örneğine göre hash hesaplama
    const hashSTR = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`;
    const paytr_token = hashSTR + merchant_salt;
    const token = crypto.createHmac('sha256', merchant_key).update(paytr_token).digest('base64');
    
    console.log('Hash String:', hashSTR);
    console.log('PayTR Token:', paytr_token);
    console.log('Final Token:', token);
    console.log('Test mode:', test_mode);
    
    // PayTR API'ye gönderilecek veriler
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
    
    res.json({
        success: true,
        token: token,
        merchant_oid: merchant_oid,
        test_mode: test_mode,
        message: 'PayTR token oluşturuldu',
        post_data: post_vals
    });
});

// PayTR Callback Route
router.post('/api/payment/callback', (req, res) => {
  console.log('PayTR Callback:', req.body);
  
  // PayTR'den gelen verileri kontrol et
  const { merchant_oid, status, total_amount } = req.body;
  
  if (status === 'success') {
    console.log('Ödeme başarılı:', merchant_oid);
    // Burada veritabanında ödeme durumunu güncelle
    res.send('OK');
  } else {
    console.log('Ödeme başarısız:', merchant_oid);
    res.send('OK');
  }
});

module.exports = router; 