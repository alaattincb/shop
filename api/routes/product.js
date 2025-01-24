const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Filtre seçenekleri için rotalar
router.get('/brands', ProductController.getAvailableBrands);
router.get('/colors', ProductController.getAvailableColors);
router.get('/sizes', ProductController.getAvailableSizes);
router.get('/price-range', ProductController.getPriceRange);

// Mevcut rotalar
router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProduct);
router.get('/category/:categoryId', ProductController.getProductsByCategory);

// Admin rotaları
router.post('/', authenticateToken, isAdmin, ProductController.createProduct);
router.put('/:id', authenticateToken, isAdmin, ProductController.updateProduct);
router.delete('/:id', authenticateToken, isAdmin, ProductController.deleteProduct);

module.exports = router; 