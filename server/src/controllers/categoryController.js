import createHttpError from "http-errors";
import { successRespone } from "../helper/respone.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../services/category.js";

/**
 * Create category
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    await createCategory(name);

    return successRespone(res, {
      statusCode: 201,
      message: "Category was created successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Categories
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleGetCategories = async (req, res, next) => {
  try {
    const categories = await getCategories();
    return successRespone(res, {
      statusCode: 200,
      message: "Categories fetched successfully",
      payload: categories,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * Get single Category
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleGetCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await getCategory(slug);
    if (!category) {
      throw createHttpError(404, "No category found with this slug");
    }
    return successRespone(res, {
      statusCode: 200,
      message: "Categories fetched successfully",
      payload: category,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * PUT Updated  Category
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleUpdateCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { name } = req.body;

    const updatedCategory = await updateCategory(slug, name);

    if (!updatedCategory) {
      throw createHttpError(404, "Category not found");
    }
    return successRespone(res, {
      statusCode: 200,
      message: "Category updated successfully",
      payload: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * PUT Updated  Category
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleDeleteCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const reslut = await deleteCategory(slug);

    if (!reslut) {
      throw createHttpError(404, "No Category found");
    }
    return successRespone(res, {
      statusCode: 200,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
