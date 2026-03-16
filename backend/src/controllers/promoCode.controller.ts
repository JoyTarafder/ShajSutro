import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import PromoCode from "../models/PromoCode";
import { AppError } from "../middleware/error.middleware";

// ─── GET /api/promo-codes  (admin) ────────────────────────────────────────────

export const getAllPromoCodes = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const codes = await PromoCode.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: codes });
  }
);

// ─── POST /api/promo-codes  (admin) ───────────────────────────────────────────

export const createPromoCode = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { code, type, value, minOrderAmount, maxUses, expiresAt, description } =
      req.body as {
        code: string;
        type: "percentage" | "fixed";
        value: number;
        minOrderAmount?: number;
        maxUses?: number | null;
        expiresAt?: string | null;
        description?: string;
      };

    if (!code || !type || value === undefined) {
      throw new AppError("code, type and value are required", 400);
    }
    if (type === "percentage" && (value <= 0 || value > 100)) {
      throw new AppError("Percentage value must be between 1 and 100", 400);
    }
    if (type === "fixed" && value <= 0) {
      throw new AppError("Fixed discount must be greater than 0", 400);
    }

    const existing = await PromoCode.findOne({ code: code.toUpperCase() });
    if (existing) throw new AppError("A promo code with that name already exists", 400);

    const promo = await PromoCode.create({
      code: code.toUpperCase(),
      type,
      value,
      minOrderAmount: minOrderAmount ?? 0,
      maxUses: maxUses ?? null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      description: description ?? "",
    });

    res.status(201).json({ success: true, data: promo });
  }
);

// ─── PUT /api/promo-codes/:id  (admin) ────────────────────────────────────────

export const updatePromoCode = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updates = req.body as Partial<{
      type: "percentage" | "fixed";
      value: number;
      minOrderAmount: number;
      maxUses: number | null;
      isActive: boolean;
      expiresAt: string | null;
      description: string;
    }>;

    const promo = await PromoCode.findByIdAndUpdate(
      id,
      {
        ...updates,
        ...(updates.expiresAt !== undefined
          ? { expiresAt: updates.expiresAt ? new Date(updates.expiresAt) : null }
          : {}),
      },
      { new: true, runValidators: true }
    );
    if (!promo) throw new AppError("Promo code not found", 404);

    res.status(200).json({ success: true, data: promo });
  }
);

// ─── DELETE /api/promo-codes/:id  (admin) ─────────────────────────────────────

export const deletePromoCode = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const promo = await PromoCode.findByIdAndDelete(req.params.id);
    if (!promo) throw new AppError("Promo code not found", 404);
    res.status(200).json({ success: true, message: "Promo code deleted" });
  }
);

// ─── POST /api/promo-codes/apply  (user — auth required) ─────────────────────

export const applyPromoCode = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { code, cartTotal } = req.body as { code: string; cartTotal: number };

    if (!code) throw new AppError("Please provide a promo code", 400);
    if (!cartTotal || cartTotal <= 0) throw new AppError("Invalid cart total", 400);

    const promo = await PromoCode.findOne({ code: code.trim().toUpperCase() });

    if (!promo || !promo.isActive) {
      throw new AppError("Invalid or inactive promo code", 400);
    }
    if (promo.expiresAt && new Date() > promo.expiresAt) {
      throw new AppError("This promo code has expired", 400);
    }
    if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
      throw new AppError("This promo code has reached its usage limit", 400);
    }
    if (cartTotal < promo.minOrderAmount) {
      throw new AppError(
        `Minimum order amount of ৳${promo.minOrderAmount} required for this code`,
        400
      );
    }

    const discount =
      promo.type === "percentage"
        ? Math.min((cartTotal * promo.value) / 100, cartTotal)
        : Math.min(promo.value, cartTotal);

    const finalTotal = Math.max(cartTotal - discount, 0);

    res.status(200).json({
      success: true,
      data: {
        code: promo.code,
        type: promo.type,
        value: promo.value,
        discount: Math.round(discount * 100) / 100,
        finalTotal: Math.round(finalTotal * 100) / 100,
        description: promo.description,
      },
    });
  }
);
