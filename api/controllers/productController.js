const Product = require('../models/Product');

// @desc    Tüm ürünleri getir
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const query = {};
        const sort = {};

        // Fiyat aralığı filtresi
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }

        // Marka filtresi
        if (req.query.brands) {
            query.brand = { $in: req.query.brands.split(',') };
        }

        // Renk filtresi
        if (req.query.colors) {
            const colors = req.query.colors.split(',');
            query['colors.name'] = { $in: colors };
        }

        // Beden filtresi
        if (req.query.sizes) {
            const sizes = req.query.sizes.split(',');
            query['sizes.name'] = { $in: sizes };
        }

        // Değerlendirme filtresi
        if (req.query.minRating) {
            query['rating.average'] = { $gte: Number(req.query.minRating) };
        }

        // Stok durumu filtresi
        if (req.query.inStock === 'true') {
            query.stock = { $gt: 0 };
        }

        // İndirim filtresi
        if (req.query.onSale === 'true') {
            query.isDiscounted = true;
        }

        // Sıralama
        if (req.query.sortBy) {
            switch (req.query.sortBy) {
                case 'price-asc':
                    sort.price = 1;
                    break;
                case 'price-desc':
                    sort.price = -1;
                    break;
                case 'rating':
                    sort['rating.average'] = -1;
                    break;
                case 'newest':
                    sort.createdAt = -1;
                    break;
                case 'popular':
                    sort.views = -1;
                    break;
            }
        }

        const products = await Product.find(query)
            .sort(sort)
            .populate('category');

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Tek bir ürün getir
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Yeni ürün ekle
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Ürün güncelle
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('category');

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Ürün sil
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı' });
        }

        await product.deleteOne();
        res.json({ message: 'Ürün başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Kategoriye göre ürünleri getir
// @route   GET /api/products/category/:categoryId
// @access  Public
exports.getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.categoryId }).populate('category');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mevcut markaları getir
exports.getAvailableBrands = async (req, res) => {
    try {
        const brands = await Product.distinct('brand');
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mevcut renkleri getir
exports.getAvailableColors = async (req, res) => {
    try {
        const colors = await Product.distinct('colors', { 'colors.name': { $exists: true } });
        const uniqueColors = [...new Set(colors.map(c => ({ name: c.name, code: c.code })))];
        res.json(uniqueColors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mevcut bedenleri getir
exports.getAvailableSizes = async (req, res) => {
    try {
        const sizes = await Product.distinct('sizes.name');
        res.json(sizes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fiyat aralığını getir
exports.getPriceRange = async (req, res) => {
    try {
        const minPrice = await Product.findOne().sort({ price: 1 }).select('price');
        const maxPrice = await Product.findOne().sort({ price: -1 }).select('price');
        
        res.json({
            min: minPrice ? minPrice.price : 0,
            max: maxPrice ? maxPrice.price : 10000
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 