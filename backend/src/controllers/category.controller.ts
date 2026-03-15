import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Category from "../models/Category";
import Product from "../models/Product";
import { AppError } from "../middleware/error.middleware";

// ─── GET /api/categories ──────────────────────────────────────────────────────

export const getCategories = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: categories,
    });
  }
);

// ─── GET /api/categories/:slug ────────────────────────────────────────────────

export const getCategoryBySlug = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) throw new AppError("Category not found", 404);

    const products = await Product.find({ category: category._id }).populate(
      "category",
      "name slug"
    );

    res.status(200).json({
      success: true,
      data: { category, products },
    });
  }
);

// ─── POST /api/categories (admin) ─────────────────────────────────────────────

export const createCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, description, image } = req.body as {
      name: string;
      description?: string;
      image?: string;
    };

    if (!name) throw new AppError("Category name is required", 400);

    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

    const category = await Category.create({ name, slug, description, image });
    res.status(201).json({
      success: true,
      message: "Category created",
      data: category,
    });
  }
);

// ─── PUT /api/categories/:id (admin) ──────────────────────────────────────────

export const updateCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, description, image } = req.body as {
      name?: string;
      description?: string;
      image?: string;
    };

    const updateData: Record<string, string | undefined> = { description, image };
    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) throw new AppError("Category not found", 404);

    res.status(200).json({
      success: true,
      message: "Category updated",
      data: category,
    });
  }
);

// ─── DELETE /api/categories/:id (admin) ───────────────────────────────────────

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new AppError("Category not found", 404);

    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      throw new AppError(
        `Cannot delete category with ${productCount} associated products`,
        400
      );
    }

    await category.deleteOne();
    res.status(200).json({
      success: true,
      message: "Category deleted",
    });
  }
);
