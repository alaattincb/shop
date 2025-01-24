import { Request, Response } from 'express';
import Favorite from '../models/favorite.model';
import { AuthRequest } from '../middleware/auth';

// Kullanıcının tüm favorilerini getir
export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await Favorite.find({ user: req.user?._id })
      .populate('product')
      .populate('product.category')
      .sort('-addedAt');
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Favoriler getirilirken bir hata oluştu.' });
  }
};

// Ürünün favorilerde olup olmadığını kontrol et
export const checkIsFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const favorite = await Favorite.findOne({
      user: req.user?._id,
      product: productId
    });
    res.json(!!favorite);
  } catch (error) {
    res.status(500).json({ message: 'Favori kontrolü yapılırken bir hata oluştu.' });
  }
};

// Favorilere ürün ekle
export const addToFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;
    const existingFavorite = await Favorite.findOne({
      user: req.user?._id,
      product: productId
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Bu ürün zaten favorilerinizde.' });
    }

    const favorite = new Favorite({
      user: req.user?._id,
      product: productId
    });

    await favorite.save();
    const populatedFavorite = await favorite.populate(['product', 'product.category']);
    res.status(201).json(populatedFavorite);
  } catch (error) {
    res.status(500).json({ message: 'Favorilere eklenirken bir hata oluştu.' });
  }
};

// Favorilerden ürün kaldır
export const removeFromFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const result = await Favorite.findOneAndDelete({
      user: req.user?._id,
      product: productId
    });

    if (!result) {
      return res.status(404).json({ message: 'Favori bulunamadı.' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Favorilerden kaldırılırken bir hata oluştu.' });
  }
}; 