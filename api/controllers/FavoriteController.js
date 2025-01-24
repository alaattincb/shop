const Favorite = require('../models/Favorite');
const Product = require('../models/Product');

// Favorilere ürün ekle
exports.addToFavorites = async (req, res) => {
    try {
        const favorite = await Favorite.create({
            user: req.user._id,
            product: req.params.productId
        });

        // Ürünün favori sayısını artır
        await Product.findByIdAndUpdate(req.params.productId, {
            $inc: { favorites: 1 }
        });

        res.status(201).json(favorite);
    } catch (error) {
        // Eğer ürün zaten favorilerdeyse
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Bu ürün zaten favorilerinizde' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Favorilerden ürün kaldır
exports.removeFromFavorites = async (req, res) => {
    try {
        const favorite = await Favorite.findOneAndDelete({
            user: req.user._id,
            product: req.params.productId
        });

        if (!favorite) {
            return res.status(404).json({ message: 'Favori bulunamadı' });
        }

        // Ürünün favori sayısını azalt
        await Product.findByIdAndUpdate(req.params.productId, {
            $inc: { favorites: -1 }
        });

        res.json({ message: 'Ürün favorilerden kaldırıldı' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Kullanıcının favori ürünlerini getir
exports.getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user._id })
            .populate({
                path: 'product',
                populate: { path: 'category' }
            })
            .sort('-addedAt');

        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ürünün favori durumunu kontrol et
exports.checkFavorite = async (req, res) => {
    try {
        const favorite = await Favorite.findOne({
            user: req.user._id,
            product: req.params.productId
        });

        res.json({ isFavorite: !!favorite });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 