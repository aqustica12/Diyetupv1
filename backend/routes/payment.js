const express = require('express');
const router = express.Router();
const crypto = require('crypto');

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
    
    const merchant_oid = Date.now().toString();
    const email = 'test@diyetup.com';
    const payment_amount = amount * 100; // Kuruş cinsinden
    
    const user_basket = JSON.stringify([
        {
            "name": "DiyetUp Paket",
            "price": payment_amount,
            "quantity": 1
        }
    ]);
    
    const user_ip = req.ip || '127.0.0.1';
    const timeout_limit = 30;
    const debug_on = 1;
    const test_mode = 0; // Canlı mod için 0
    const no_installment = 0;
    const max_installment = 0;
    const currency = "TL";
    const lang = "tr";
    
    const hash_str = merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode;
    const paytr_token = crypto.createHmac('sha256', merchant_salt).update(hash_str).digest('base64');
    
    const post_vals = {
        merchant_id: merchant_id,
        user_ip: user_ip,
        merchant_oid: merchant_oid,
        email: email,
        payment_amount: payment_amount,
        paytr_token: paytr_token,
        user_basket: user_basket,
        debug_on: debug_on,
        no_installment: no_installment,
        max_installment: max_installment,
        user_name: "DiyetUp User",
        user_address: "Turkey",
        user_phone: "5551234567",
        merchant_ok_url: "https://diyetup.com/payment/success",
        merchant_fail_url: "https://diyetup.com/payment/error",
        timeout_limit: timeout_limit,
        currency: currency,
        test_mode: test_mode,
        lang: lang
    };
    
    console.log('PayTR Token oluşturuldu:', paytr_token);
    console.log('Test mode:', test_mode);
    console.log('Callback URLs:', {
        success: "https://diyetup.com/payment/success",
        fail: "https://diyetup.com/payment/error"
    });
    
    res.json({
        success: true,
        token: paytr_token,
        merchant_oid: merchant_oid,
        test_mode: false,
        message: 'Canlı PayTR hesabı ile çalışıyor',
        post_data: post_vals
    });
});

module.exports = router; 