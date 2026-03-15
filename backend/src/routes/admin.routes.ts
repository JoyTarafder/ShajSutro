import { Router } from "express";
import {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/admin.controller";
import { protect, adminOnly } from "../middleware/auth.middleware";

const router = Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);

// User management
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Order management
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

export default router;
