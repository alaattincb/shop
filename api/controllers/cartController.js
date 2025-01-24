const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Kullanıcının sepetini getir
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product', 'name price imageUrl');

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: []
            });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Sepete ürün ekle
// @route   POST /api/cart/items
// @access  Private
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Ürünü kontrol et
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı' });
        }

        // Stok kontrolü
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Yetersiz stok' });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        // Sepet yoksa oluştur
        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: []
            });
        }

        // Ürün sepette var mı kontrol et
        const existingItem = cart.items.find(item => 
            item.product.toString() === productId
        );

        if (existingItem) {
            // Miktarı güncelle
            existingItem.quantity += quantity;
            existingItem.price = product.price;
        } else {
            // Yeni ürün ekle
            cart.items.push({
                product: productId,
                quantity,
                price: product.price
            });
        }

        await cart.save();
        await cart.populate('items.product', 'name price imageUrl');

        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Sepetten ürün çıkar
// @route   DELETE /api/cart/items/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Sepet bulunamadı' });
        }

        cart.items = cart.items.filter(item => 
            item.product.toString() !== req.params.productId
        );

        await cart.save();
        await cart.populate('items.product', 'name price imageUrl');

        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Sepetteki ürün miktarını güncelle
// @route   PUT /api/cart/items/:productId
// @access  Private
exports.updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            return res.status(404).json({ message: 'Sepet bulunamadı' });
        }

        const cartItem = cart.items.find(item => 
            item.product.toString() === req.params.productId
        );

        if (!cartItem) {
            return res.status(404).json({ message: 'Ürün sepette bulunamadı' });
        }

        // Ürün stok kontrolü
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Yetersiz stok' });
        }

        cartItem.quantity = quantity;
        cartItem.price = product.price;

        await cart.save();
        await cart.populate('items.product', 'name price imageUrl');

        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Sepeti temizle
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            return res.status(404).json({ message: 'Sepet bulunamadı' });
        }

        cart.items = [];
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; 