import { Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../types";

// ─── Helper: generate JWT ────────────────────────────────────────────────────

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN ?? "7d";
  if (!secret) throw new AppError("JWT_SECRET not configured", 500);
  return jwt.sign({ id }, secret, { expiresIn } as jwt.SignOptions);
};

// ─── POST /api/auth/register ──────────────────────────────────────────────────

export const register = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: "user" | "admin";
    };

    if (!name || !email || !password) {
      throw new AppError("Please provide name, email, and password", 400);
    }

    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError("An account with that email already exists", 400);
    }

    const user = await User.create({ name, email, password, role: role ?? "user" });
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
);

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

export const login = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      throw new AppError("Please provide email and password", 400);
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
);

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

export const getMe = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const user = req.user;
    res.status(200).json({
      success: true,
      data: {
        id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        createdAt: user?.createdAt,
      },
    });
  }
);

// ─── PUT /api/auth/me ─────────────────────────────────────────────────────────

export const updateMe = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { name, email } = req.body as { name?: string; email?: string };

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { name, email },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated",
      data: user,
    });
  }
);

// ─── PUT /api/auth/change-password ────────────────────────────────────────────

export const changePassword = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };

    if (!currentPassword || !newPassword) {
      throw new AppError("Please provide current and new passwords", 400);
    }

    const user = await User.findById(req.user?._id).select("+password");
    if (!user) throw new AppError("User not found", 404);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new AppError("Current password is incorrect", 400);

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  }
);
