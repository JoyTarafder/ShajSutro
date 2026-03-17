import { Router } from "express";
import {
  createCategory,
  createSubcategory,
  deleteCategory,
  getCategories,
  getCategoryBySlug,
  getSubcategories,
  updateCategory,
} from "../controllers/category.controller";
import { adminOnly, protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getCategories);
router.get("/subcategories/:id", getSubcategories);
router.get("/:id/subcategories", getSubcategories);
router.post("/:id/subcategories", protect, adminOnly, createSubcategory);
router.get("/:slug", getCategoryBySlug);
router.post("/", protect, adminOnly, createCategory);
router.put("/:id", protect, adminOnly, updateCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
