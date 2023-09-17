import slugify from "slugify";
import AppError from "../helpers/appError.js";
import catchAsync from "../helpers/catchAsync.js";
import Category from "../models/categoryModel.js";

// Create new categry DB
export const createCategory = catchAsync(async (req, res, next) => {
  const newCategory = await Category.create({
    name: req.body.name,
  });

  const { name } = req.body;

  // Check the name is exists
  const existName = await Category.findOne({ name });
  if (!existName) {
    return next(new AppError("Name is required", 400));
  }

  res.status(200).json({
    status: "success",
    category: newCategory,
  });
});

// Get all data
export const getAllCategory = catchAsync(async (req, res, next) => {
  const category = await Category.find();

  res.status(200).json({
    status: "success",
    result: category.length,
    data: {
      category,
    },
  });
});

// Find category
export const getOneCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug });

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

// PATCH (update category)
export const updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(new AppError("No category found with that ID", 404));
  }

  // Manually update the slug based on the updated name
  category.slug = slugify(category.name);
  await category.save();

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

// DELETE category
export const deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError("No category found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export default { createCategory, updateCategory };
