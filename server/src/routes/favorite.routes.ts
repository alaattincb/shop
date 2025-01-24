import express from 'express';
import { authenticateToken } from '../middleware/auth';
import * as favoriteController from '../controllers/favorite.controller';

const router = express.Router();

// Tüm favorileri getir
router.get('/', authenticateToken, favoriteController.getFavorites);

// Favori kontrolü
router.get('/check/:productId', authenticateToken, favoriteController.checkIsFavorite);

// Favorilere ekle
router.post('/', authenticateToken, favoriteController.addToFavorites);

// Favorilerden kaldır
router.delete('/:productId', authenticateToken, favoriteController.removeFromFavorites);

export default router; 