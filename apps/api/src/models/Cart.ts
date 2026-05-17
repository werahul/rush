import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICartItem {
  productId: Types.ObjectId;
  sku: string;
  name: string;
  slug?: string;
  image?: string;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
  maxStock: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: Types.DocumentArray<ICartItem>;
}

const cartItemSchema = new Schema<ICartItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  sku: { type: String, required: true },
  name: { type: String, required: true },
  slug: String,
  image: String,
  size: String,
  color: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  maxStock: { type: Number, default: 99 },
});

const cartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

cartSchema.index({ userId: 1 });

export const Cart = mongoose.model<ICart>('Cart', cartSchema);
