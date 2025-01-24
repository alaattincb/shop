const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProduct, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    getProductsByCategory 
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getProducts)
    .post(protect, authorize('admin'), createProduct);

router.route('/:id')
    .get(getProduct)
    .put(protect, authorize('admin'), updateProduct)
    .delete(protect, authorize('admin'), deleteProduct);

router.get('/category/:categoryId', getProductsByCategory);

module.exports = router; 