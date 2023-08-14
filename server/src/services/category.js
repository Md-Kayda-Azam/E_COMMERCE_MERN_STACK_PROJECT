import slugify from "slugify";
import Category from "../models/modelCategory.js";
import createHttpError from "http-errors";

/**
 * Create category service
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const createCategory = async (name) => {
  const newCategory = await Category.create({
    name: name,
    slug: slugify(name, {
      lower: true,
    }),
  });

  return newCategory;
};
/**
 * GET All categories service
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const getCategories = async () => {
  return await Category.find({}).select("name slug").lean();
};
/**
 * GET Single category service
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const getCategory = async (slug) => {
  const checkSlug = await Category.findOne({ slug: slug });

  if (checkSlug) {
    return await Category.find({ slug }).select("name slug").lean();
  } else {
    throw createHttpError(404, "Invalid slug!");
  }
};
/**
 * PUT updated category service
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const updateCategory = async (slug, name) => {
  const { filter } = slug;
  const updates = {
    $set: {
      name: name,
      slug: slugify(name, {
        lower: true,
      }),
    },
  };
  const option = { new: true };
  const checkSlug = await Category.findOne({ slug: slug });

  if (checkSlug) {
    return await Category.findOneAndUpdate(filter, updates, option);
  } else {
    throw createHttpError(404, "Invalid slug!");
  }
};
/**
 * PUT updated category service
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const deleteCategory = async (slug) => {
  const reslut = await Category.findOneAndDelete({ slug });
  return reslut;
};
