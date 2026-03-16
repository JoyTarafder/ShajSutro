import { Router } from "express";
import {
  placeOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getOrderInvoice,
} from "../controllers/order.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// All order routes require authentication
router.use(protect);

router.post("/", placeOrder);
router.get("/", getMyOrders);
router.get("/:id", getOrder);
router.get("/:id/invoice", getOrderInvoice);
router.put("/:id/cancel", cancelOrder);

export default router;
