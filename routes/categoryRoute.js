import express from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getOneCategory,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router
  .route("/")
  .get(getAllCategory)
  .post(protect, restrictTo("admin"), createCategory);

router.route("/:slug").get(getOneCategory);

router
  .route("/:id")
  .patch(protect, restrictTo("admin"), updateCategory)
  .delete(protect, restrictTo("admin"), deleteCategory);

export default router;
