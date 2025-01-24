const express = require('express');
const router = express.Router();
const FavoriteController = require('../controllers/FavoriteController');
const { authenticateToken } = require('../middleware/auth');

// Tüm rotalarda authentication gerekli
router.use(authenticateToken);

// Favori ürünleri listele
router.get('/', FavoriteController.getFavorites);

// Ürünün favori durumunu kontrol et
router.get('/check/:productId', FavoriteController.checkFavorite);

// Favorilere ürün ekle
router.post('/:productId', FavoriteController.addToFavorites);

// Favorilerden ürün kaldır
router.delete('/:productId', FavoriteController.removeFromFavorites);

module.exports = router; 