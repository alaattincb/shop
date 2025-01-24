const express = require('express');
const router = express.Router();
const { 
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect); // Tüm sepet işlemleri için authentication gerekli

router.route('/')
    .get(getCart)
    .delete(clearCart);

router.route('/items')
    .post(addToCart);

router.route('/items/:productId')
    .delete(removeFromCart)
    .put(updateCartItem);

module.exports = router; 