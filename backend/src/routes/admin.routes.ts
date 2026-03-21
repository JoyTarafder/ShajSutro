import { Router } from "express";
import {
  getDashboardStats,
  getAdminProducts,
  getAllUsers,
  createUser,
  updateUser,
  blockUser,
  deleteUser,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  confirmPayment,
  getAllContactMessages,
  markContactMessageRead,
} from "../controllers/admin.controller";
import { protect, adminOnly } from "../middleware/auth.middleware";

const router = Router();

router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);

// Product management (admin view — includes hidden products)
router.get("/products", getAdminProducts);

// User management
router.get("/users", getAllUsers);
router.post("/users", createUser);
// More specific routes must come before /users/:id
router.put("/users/:id/block", blockUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Order management
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderDetails);
router.put("/orders/:id/status", updateOrderStatus);
router.put("/orders/:id/confirm-payment", confirmPayment);

// Contact messages
router.get("/messages", getAllContactMessages);
router.put("/messages/:id/read", markContactMessageRead);

export default router;
