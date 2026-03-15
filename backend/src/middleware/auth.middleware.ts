import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User";
import { AppError } from "./error.middleware";
import { AuthRequest } from "../types";

interface JwtPayload {
  id: string;
}

// ─── protect: verify JWT and attach req.user ──────────────────────────────────

export const protect = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("Not authorized — no token provided", 401));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError("JWT_SECRET not configured", 500);

    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new AppError("User belonging to this token no longer exists", 401));
    }

    req.user = user;
    next();
  }
);

// ─── adminOnly: restrict access to admin role ─────────────────────────────────

export const adminOnly = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== "admin") {
    return next(new AppError("Access denied — admin only", 403));
  }
  next();
};
