import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User";
import Order from "../models/Order";
import Product from "../models/Product";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../types";

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────

export const getDashboardStats = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      revenueResult,
      ordersByStatus,
      recentOrders,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Order.countDocuments(),
      Product.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email"),
    ]);

    const totalRevenue: number =
      (revenueResult[0] as { total?: number } | undefined)?.total ?? 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue,
        ordersByStatus,
        recentOrders,
      },
    });
  }
);

// ─── GET /api/admin/users ─────────────────────────────────────────────────────

export const getAllUsers = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const page = Math.max(1, parseInt((req.query.page as string) ?? "1"));
    const limit = Math.min(50, parseInt((req.query.limit as string) ?? "20"));
    const skip = (page - 1) * limit;
    const search = req.query.search as string | undefined;

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  }
);

// ─── PUT /api/admin/users/:id ─────────────────────────────────────────────────

export const updateUser = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { role, name } = req.body as { role?: "user" | "admin"; name?: string };

    // Prevent self-demotion
    if (req.user?._id.toString() === req.params.id && role === "user") {
      throw new AppError("You cannot demote your own admin account", 400);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, name },
      { new: true, runValidators: true }
    );

    if (!user) throw new AppError("User not found", 404);

    res.status(200).json({
      success: true,
      message: "User updated",
      data: user,
    });
  }
);

// ─── DELETE /api/admin/users/:id ──────────────────────────────────────────────

export const deleteUser = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    if (req.user?._id.toString() === req.params.id) {
      throw new AppError("You cannot delete your own account", 400);
    }

    const user = await User.findById(req.params.id);
    if (!user) throw new AppError("User not found", 404);

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  }
);

// ─── GET /api/admin/orders ────────────────────────────────────────────────────

export const getAllOrders = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = Math.max(1, parseInt((req.query.page as string) ?? "1"));
    const limit = Math.min(50, parseInt((req.query.limit as string) ?? "20"));
    const skip = (page - 1) * limit;
    const status = req.query.status as string | undefined;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name email"),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  }
);

// ─── PUT /api/admin/orders/:id/status ────────────────────────────────────────

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { status } = req.body as {
      status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
    };

    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`, 400);
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!order) throw new AppError("Order not found", 404);

    res.status(200).json({
      success: true,
      message: `Order status updated to '${status}'`,
      data: order,
    });
  }
);
