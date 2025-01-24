const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const questionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String
    },
    answeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    answeredAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ürün adı zorunludur']
    },
    description: {
        type: String,
        required: [true, 'Ürün açıklaması zorunludur']
    },
    price: {
        type: Number,
        required: [true, 'Ürün fiyatı zorunludur'],
        min: [0, 'Fiyat 0\'dan küçük olamaz']
    },
    oldPrice: {
        type: Number,
        min: [0, 'Eski fiyat 0\'dan küçük olamaz']
    },
    stock: {
        type: Number,
        required: [true, 'Stok miktarı zorunludur'],
        min: [0, 'Stok miktarı 0\'dan küçük olamaz']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Kategori zorunludur']
    },
    brand: {
        type: String,
        required: [true, 'Marka zorunludur']
    },
    model: {
        type: String
    },
    serialNumber: {
        type: String,
        unique: true
    },
    colors: [{
        name: String,
        code: String,
        images: [String],
        stock: Number
    }],
    sizes: [{
        name: String,
        stock: Number
    }],
    specifications: [{
        name: String,
        value: String
    }],
    materials: [{
        name: String,
        percentage: Number
    }],
    dimensions: {
        width: Number,
        height: Number,
        depth: Number,
        unit: {
            type: String,
            enum: ['cm', 'mm', 'inch'],
            default: 'cm'
        }
    },
    weight: {
        value: Number,
        unit: {
            type: String,
            enum: ['kg', 'g', 'lb'],
            default: 'kg'
        }
    },
    origin: {
        country: String,
        city: String
    },
    warranty: {
        duration: Number, // Ay cinsinden
        type: String,
        description: String
    },
    shipping: {
        weight: Number,
        dimensions: {
            width: Number,
            height: Number,
            depth: Number
        },
        freeShipping: {
            type: Boolean,
            default: false
        },
        estimatedDelivery: {
            min: Number,
            max: Number,
            unit: {
                type: String,
                enum: ['day', 'week'],
                default: 'day'
            }
        }
    },
    features: [{
        type: String
    }],
    tags: [{
        type: String
    }],
    images: [{
        type: String,
        required: [true, 'En az bir ürün görseli zorunludur']
    }],
    mainImage: {
        type: String,
        required: [true, 'Ana ürün görseli zorunludur']
    },
    reviews: [reviewSchema],
    questions: [questionSchema],
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    favorites: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDiscounted: {
        type: Boolean,
        default: false
    },
    discountPercentage: {
        type: Number,
        min: 0,
        max: 100
    },
    installmentOptions: [{
        month: Number,
        amount: Number,
        bankName: String
    }],
    giftOptions: {
        available: {
            type: Boolean,
            default: false
        },
        message: String,
        price: Number
    },
    manufacturingDate: {
        type: Date
    },
    expiryDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Güncelleme tarihini otomatik güncelle
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    
    // İndirim hesaplama
    if (this.oldPrice && this.price) {
        this.isDiscounted = this.oldPrice > this.price;
        this.discountPercentage = this.isDiscounted 
            ? Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100) 
            : 0;
    }

    // Ortalama puanı hesaplama
    if (this.reviews.length > 0) {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.rating.average = totalRating / this.reviews.length;
        this.rating.count = this.reviews.length;
    }

    next();
});

module.exports = mongoose.model('Product', productSchema); 