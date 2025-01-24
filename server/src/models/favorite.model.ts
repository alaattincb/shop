import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
import { IProduct } from './product.model';

export interface IFavorite extends Document {
  user: IUser['_id'];
  product: IProduct['_id'];
  addedAt: Date;
}

const favoriteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Bir kullanıcı bir ürünü sadece bir kez favorilere ekleyebilir
favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model<IFavorite>('Favorite', favoriteSchema); 