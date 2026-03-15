import { Response } from "express";
import asyncHandler from "express-async-handler";
import Order from "../models/Order";
import Cart from "../models/Cart";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest, IShippingAddress } from "../types";

// ─── POST /api/orders — place order from cart ─────────────────────────────────

export const placeOrder = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { shippingAddress, paymentMethod = "card" } = req.body as {
      shippingAddress: IShippingAddress;
      paymentMethod?: string;
    };

    if (!shippingAddress) {
      throw new AppError("Shipping address is required", 400);
    }

    const cart = await Cart.findOne({ user: req.user?._id }).populate(
      "items.product",
      "name price images inStock"
    );

    if (!cart || cart.items.length === 0) {
      throw new AppError("Cart is empty — add items before placing an order", 400);
    }

    interface PopulatedProduct {
      _id: unknown;
      name: string;
      price: number;
      images: string[];
      inStock: boolean;
    }

    // Check all items are in stock
    for (const item of cart.items) {
      const product = item.product as unknown as PopulatedProduct;
      if (!product.inStock) {
        throw new AppError(`"${product.name}" is out of stock`, 400);
      }
    }

    // Build order items from cart
    const orderItems = cart.items.map((item) => {
      const product = item.product as unknown as PopulatedProduct;
      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: product.images[0] ?? "",
      };
    });

    // Calculate totals
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingCost = subtotal >= 150 ? 0 : 9.99;
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const total = parseFloat((subtotal + shippingCost + tax).toFixed(2));

    const order = await Order.create({
      user: req.user?._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      total,
      status: "pending",
    });

    // Clear cart after order is placed
    await Cart.findOneAndUpdate({ user: req.user?._id }, { items: [] });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  }
);

// ─── GET /api/orders — user order history ─────────────────────────────────────

export const getMyOrders = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const page = Math.max(1, parseInt((req.query.page as string) ?? "1"));
    const limit = Math.min(20, parseInt((req.query.limit as string) ?? "10"));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user?._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ user: req.user?._id }),
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  }
);

// ─── GET /api/orders/:id — single order ───────────────────────────────────────

export const getOrder = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) throw new AppError("Order not found", 404);

    // Allow access only to the owner or admin
    if (
      order.user._id.toString() !== req.user?._id.toString() &&
      req.user?.role !== "admin"
    ) {
      throw new AppError("Not authorized to view this order", 403);
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  }
);

// ─── PUT /api/orders/:id/cancel — cancel order ────────────────────────────────

export const cancelOrder = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const order = await Order.findById(req.params.id);
    if (!order) throw new AppError("Order not found", 404);

    if (order.user.toString() !== req.user?._id.toString()) {
      throw new AppError("Not authorized", 403);
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      throw new AppError(
        `Cannot cancel an order with status '${order.status}'`,
        400
      );
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled",
      data: order,
    });
  }
);
