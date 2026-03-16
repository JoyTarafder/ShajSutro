import { Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../types";
import { sendVerificationEmail, sendPasswordResetEmail } from "../services/emailService";

const generateVerificationCode = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

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

    const code = generateVerificationCode();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      name,
      email,
      password,
      role: role ?? "user",
      verificationCode: code,
      verificationCodeExpiry: expiry,
    });

    await sendVerificationEmail(email, code);

    res.status(201).json({
      success: true,
      message: "Account created. Please check your email for the verification code.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
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

    if (user.isBlocked) {
      throw new AppError("Your account has been blocked. Please contact support.", 403);
    }

    if (!user.isEmailVerified) {
      throw new AppError("Please verify your email before logging in.", 403);
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

// ─── POST /api/auth/verify-email ──────────────────────────────────────────────

export const verifyEmail = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { email, code } = req.body as { email: string; code: string };

    if (!email || !code) {
      throw new AppError("Please provide email and verification code", 400);
    }

    const user = await User.findOne({ email }).select(
      "+verificationCode +verificationCodeExpiry"
    );

    if (!user) throw new AppError("No account found with that email", 404);
    if (user.isEmailVerified) {
      throw new AppError("Email is already verified", 400);
    }
    if (!user.verificationCode || !user.verificationCodeExpiry) {
      throw new AppError("No verification code found. Please request a new one.", 400);
    }
    if (new Date() > user.verificationCodeExpiry) {
      throw new AppError("Verification code has expired. Please request a new one.", 400);
    }
    if (user.verificationCode !== code) {
      throw new AppError("Invalid verification code", 400);
    }

    user.isEmailVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  }
);

// ─── POST /api/auth/resend-verification ───────────────────────────────────────

export const resendVerificationCode = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { email } = req.body as { email: string };

    if (!email) throw new AppError("Please provide an email", 400);

    const user = await User.findOne({ email });
    if (!user) throw new AppError("No account found with that email", 404);
    if (user.isEmailVerified) {
      throw new AppError("Email is already verified", 400);
    }

    const code = generateVerificationCode();
    user.verificationCode = code;
    user.verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(email, code);

    res.status(200).json({
      success: true,
      message: "A new verification code has been sent to your email.",
    });
  }
);

// ─── POST /api/auth/forgot-password ───────────────────────────────────────────

export const forgotPassword = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { email } = req.body as { email: string };

    if (!email) throw new AppError("Please provide an email address", 400);

    const user = await User.findOne({ email });
    // Always respond success to prevent email enumeration
    if (!user) {
      res.status(200).json({
        success: true,
        message: "If that email exists, a reset code has been sent.",
      });
      return;
    }

    const code = generateVerificationCode();
    user.passwordResetCode = code;
    user.passwordResetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail(email, code);

    res.status(200).json({
      success: true,
      message: "A password reset code has been sent to your email.",
    });
  }
);

// ─── POST /api/auth/reset-password ────────────────────────────────────────────

export const resetPassword = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { email, code, newPassword } = req.body as {
      email: string;
      code: string;
      newPassword: string;
    };

    if (!email || !code || !newPassword) {
      throw new AppError("Please provide email, code, and new password", 400);
    }
    if (newPassword.length < 6) {
      throw new AppError("Password must be at least 6 characters", 400);
    }

    const user = await User.findOne({ email }).select(
      "+passwordResetCode +passwordResetCodeExpiry"
    );

    if (!user) throw new AppError("No account found with that email", 404);
    if (!user.passwordResetCode || !user.passwordResetCodeExpiry) {
      throw new AppError("No reset code found. Please request a new one.", 400);
    }
    if (new Date() > user.passwordResetCodeExpiry) {
      throw new AppError("Reset code has expired. Please request a new one.", 400);
    }
    if (user.passwordResetCode !== code) {
      throw new AppError("Invalid reset code", 400);
    }

    user.password = newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now sign in.",
    });
  }
);
