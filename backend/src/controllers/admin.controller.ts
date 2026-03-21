import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import ContactMessage from "../models/ContactMessage";
import User from "../models/User";
import Order from "../models/Order";
import Product from "../models/Product";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../types";

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────

export const getDashboardStats = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const today = new Date();
    const toYmd = (d: Date): string => d.toISOString().slice(0, 10);

    const [
      totalUsers,
      totalOrders,
      totalProducts,
      revenueResult,
      ordersByStatus,
      recentOrders,
      revenueByDay,
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
      Order.aggregate([
        {
          $match: {
            status: { $ne: "cancelled" },
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            revenue: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { date: "$_id", revenue: 1, _id: 0 } },
      ]),
    ]);

    const totalRevenue: number =
      (revenueResult[0] as { total?: number } | undefined)?.total ?? 0;

    // Build a dense 30-day revenue series so charts always render predictable X-axis data.
    const revenueMap = new Map<string, number>(
      (revenueByDay as Array<{ date?: string; revenue?: number }>).map((item) => [
        String(item.date ?? ""),
        typeof item.revenue === "number" && Number.isFinite(item.revenue)
          ? item.revenue
          : 0,
      ])
    );

    const revenueByDaySeries: { date: string; revenue: number }[] = [];
    for (let i = 29; i >= 0; i -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const key = toYmd(date);
      revenueByDaySeries.push({ date: key, revenue: revenueMap.get(key) ?? 0 });
    }

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue,
        ordersByStatus,
        recentOrders,
        revenueByDay: revenueByDaySeries,
      },
    });
  }
);

// ─── GET /api/admin/products ──────────────────────────────────────────────────
// Returns ALL products (including hidden) for admin management

export const getAdminProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = Math.max(1, parseInt((req.query.page as string) ?? "1"));
    const limit = Math.min(50, parseInt((req.query.limit as string) ?? "12"));
    const skip = (page - 1) * limit;
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
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

// ─── POST /api/admin/users ────────────────────────────────────────────────────

export const createUser = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const { name, email, password, role } = _req.body as {
      name: string;
      email: string;
      password: string;
      role?: "user" | "admin";
    };

    if (!name || !email || !password) {
      throw new AppError("Name, email, and password are required", 400);
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) throw new AppError("A user with this email already exists", 409);

    const user = await User.create({
      name,
      email,
      password,
      role: role ?? "user",
    });

    res.status(201).json({
      success: true,
      message: "User created",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        createdAt: user.createdAt,
      },
    });
  }
);

// ─── PUT /api/admin/users/:id ─────────────────────────────────────────────────

export const updateUser = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { role, name } = req.body as { role?: "user" | "admin"; name?: string };

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

// ─── PUT /api/admin/users/:id/block ──────────────────────────────────────────

export const blockUser = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    if (req.user?._id.toString() === req.params.id) {
      throw new AppError("You cannot block your own account", 400);
    }

    const user = await User.findById(req.params.id);
    if (!user) throw new AppError("User not found", 404);

    if (user.role === "admin") {
      throw new AppError("Admin accounts cannot be blocked", 400);
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked ? "User blocked" : "User unblocked",
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
    const dateFrom = req.query.dateFrom as string | undefined;
    const dateTo = req.query.dateTo as string | undefined;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    if (dateFrom || dateTo) {
      const dateFilter: Record<string, Date> = {};
      if (dateFrom) dateFilter.$gte = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
      filter.createdAt = dateFilter;
    }

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

// ─── GET /api/admin/orders/:id ────────────────────────────────────────────────

export const getOrderDetails = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) throw new AppError("Order not found", 404);

    res.status(200).json({
      success: true,
      data: order,
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

// ─── PUT /api/admin/orders/:id/confirm-payment ────────────────────────────────

export const confirmPayment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) throw new AppError("Order not found", 404);

    if (order.paymentStatus === "paid") {
      throw new AppError("Payment is already confirmed", 400);
    }

    order.paymentStatus = "paid";
    // Also move status to confirmed when payment verified
    if (order.status === "pending") {
      order.status = "confirmed";
    }
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
      data: order,
    });
  }
);

// ─── GET /api/admin/messages ─────────────────────────────────────────────────

export const getAllContactMessages = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = Math.max(1, parseInt((req.query.page as string) ?? "1"));
    const limit = Math.min(100, parseInt((req.query.limit as string) ?? "20"));
    const skip = (page - 1) * limit;
    const isRead = req.query.isRead as string | undefined;

    const filter: Record<string, unknown> = {};
    if (isRead === "true" || isRead === "false") {
      filter.isRead = isRead === "true";
    }

    const [messages, total, unreadCount] = await Promise.all([
      ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ContactMessage.countDocuments(filter),
      ContactMessage.countDocuments({ isRead: false }),
    ]);

    res.status(200).json({
      success: true,
      data: messages,
      meta: { unreadCount },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  },
);

// ─── PUT /api/admin/messages/:id/read ────────────────────────────────────────

export const markContactMessageRead = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true },
    );

    if (!message) throw new AppError("Message not found", 404);

    res.status(200).json({
      success: true,
      message: "Message marked as read",
      data: message,
    });
  },
);
