import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/Product";
import { AppError } from "../middleware/error.middleware";

// ─── GET /api/products ────────────────────────────────────────────────────────

export const getProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      category,
      badge,
      minPrice,
      maxPrice,
      inStock,
      search,
      sort = "-createdAt",
      page = "1",
      limit = "12",
    } = req.query as Record<string, string | undefined>;

    const filter: Record<string, unknown> = { isVisible: { $ne: false } };

    if (category) filter.category = category;
    if (badge) filter.badge = badge;
    if (inStock !== undefined) filter.inStock = inStock === "true";

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit ?? "12"));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  }
);

// ─── GET /api/products/:id ────────────────────────────────────────────────────

export const getProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name slug"
    );
    if (!product) throw new AppError("Product not found", 404);

    res.status(200).json({
      success: true,
      data: product,
    });
  }
);

// ─── POST /api/products (admin) ───────────────────────────────────────────────

export const createProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      images,
      sizes,
      colors,
      badge,
      inStock,
      isFeatured,
      isVisible,
      stock,
      tags,
    } = req.body as {
      name: string;
      description: string;
      price: number;
      originalPrice?: number;
      category: string;
      images?: string[];
      sizes?: string[];
      colors?: string[];
      badge?: "New" | "Sale" | "Best Seller";
      inStock?: boolean;
      isFeatured?: boolean;
      isVisible?: boolean;
      stock?: number;
      tags?: string[];
    };

    if (!name || !description || !price || !category) {
      throw new AppError("Name, description, price, and category are required", 400);
    }

    const slug =
      name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") +
      "-" +
      Date.now();

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      originalPrice,
      category,
      images: images ?? [],
      sizes: sizes ?? [],
      colors: colors ?? [],
      badge,
      inStock: inStock ?? true,
      isFeatured: isFeatured ?? false,
      isVisible: isVisible ?? true,
      stock: stock ?? 0,
      tags: tags ?? [],
    });

    const populated = await product.populate("category", "name slug");

    res.status(201).json({
      success: true,
      message: "Product created",
      data: populated,
    });
  }
);

// ─── PUT /api/products/:id (admin) ────────────────────────────────────────────

export const updateProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const updates = req.body as Partial<{
      name: string;
      description: string;
      price: number;
      originalPrice: number;
      category: string;
      images: string[];
      sizes: string[];
      colors: string[];
      badge: string;
      inStock: boolean;
      isFeatured: boolean;
      isVisible: boolean;
      stock: number;
      tags: string[];
    }>;

    if (updates.name) {
      (updates as Record<string, unknown>).slug =
        updates.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") +
        "-" +
        Date.now();
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");

    if (!product) throw new AppError("Product not found", 404);

    res.status(200).json({
      success: true,
      message: "Product updated",
      data: product,
    });
  }
);

// ─── DELETE /api/products/:id (admin) ─────────────────────────────────────────

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new AppError("Product not found", 404);

    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  }
);
