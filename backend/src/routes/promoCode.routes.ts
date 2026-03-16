import { Router } from "express";
import {
  getAllPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  applyPromoCode,
} from "../controllers/promoCode.controller";
import { protect, adminOnly } from "../middleware/auth.middleware";

const router = Router();

// Public — anyone can validate/apply a promo code
router.post("/apply", applyPromoCode);

// Admin only — CRUD
router.use(protect, adminOnly);
router.get("/", getAllPromoCodes);
router.post("/", createPromoCode);
router.put("/:id", updatePromoCode);
router.delete("/:id", deletePromoCode);

export default router;
