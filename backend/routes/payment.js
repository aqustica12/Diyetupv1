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
    console.log('Environment variables:', {
        PAYTR_MERCHANT_ID: process.env.PAYTR_MERCHANT_ID,
        PAYTR_MERCHANT_KEY: process.env.PAYTR_MERCHANT_KEY,
        PAYTR_MERCHANT_SALT: process.env.PAYTR_MERCHANT_SALT
    });
    
    const { amount, user_id, package_id } = req.body;
    
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
    
    const user_ip = req.ip;
    const timeout_limit = 30;
    const debug_on = 1;
    const test_mode = 1;
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
        user_name: "Test User",
        user_address: "Test Address",
        user_phone: "5551234567",
        merchant_ok_url: "http://localhost:3000/payment/success",
        merchant_fail_url: "http://localhost:3000/payment/error",
        timeout_limit: timeout_limit,
        currency: currency,
        test_mode: test_mode,
        lang: lang
    };
    
    res.json({
        success: true,
        token: paytr_token,
        merchant_oid: merchant_oid,
        post_data: post_vals
    });
});

module.exports = router; 