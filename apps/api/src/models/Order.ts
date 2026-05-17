import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  slug?: string;
  image?: string;
  sku: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
}

export interface IOrderTimeline {
  status: string;
  message: string;
  timestamp: Date;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId: Types.ObjectId;
  items: Types.DocumentArray<IOrderItem>;
  shippingAddress: Record<string, unknown>;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  couponCode?: string;
  status: string;
  paymentStatus: string;
  paymentProvider?: string;
  paymentId?: string;
  timeline: Types.DocumentArray<IOrderTimeline>;
  trackingNumber?: string;
  cancelReason?: string;
}

const orderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  slug: String,
  image: String,
  sku: { type: String, required: true },
  size: String,
  color: String,
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const timelineSchema = new Schema<IOrderTimeline>({
  status: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const addressSchema = new Schema({
  label: String,
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  line1: { type: String, required: true },
  line2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'IN' },
});

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: { type: addressSchema, required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: String,
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'returned',
        'refunded',
      ],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentProvider: { type: String, enum: ['stripe', 'razorpay', 'cod'] },
    paymentId: String,
    timeline: [timelineSchema],
    trackingNumber: String,
    cancelReason: String,
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
