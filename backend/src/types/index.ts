import { Request } from "express";
import { Document, Types } from "mongoose";

// ─── Extended Express Request ─────────────────────────────────────────────────

export interface AuthRequest extends Request {
  user?: IUserDocument;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt?: Date;
}

export interface ICategoryDocument extends ICategory, Document {
  _id: Types.ObjectId;
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Types.ObjectId;
  images: string[];
  sizes: string[];
  colors: string[];
  badge?: "New" | "Sale" | "Best Seller";
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductDocument extends IProduct, Document {
  _id: Types.ObjectId;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
  size: string;
  color: string;
}

export interface ICart {
  user: Types.ObjectId;
  items: ICartItem[];
  updatedAt?: Date;
}

export interface ICartDocument extends ICart, Document {
  _id: Types.ObjectId;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface IShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface IOrder {
  user: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrderDocument extends IOrder, Document {
  _id: Types.ObjectId;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
