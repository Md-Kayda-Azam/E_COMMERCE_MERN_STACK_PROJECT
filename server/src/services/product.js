import slugify from "slugify";
import createError from "http-errors";
import Product from "../models/modelProduct.js";
import { runValidators } from "../validators/index.js";
/**
 * Create Product service
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const createProduct = async (productData) => {
  const { name, description, price, quantity, shiping, category, image } =
    productData;
  const productExsits = await Product.exists({ name: name });

  if (productExsits) {
    throw createError(409, "Product with this name already axists.");
  }

  // create product
  const product = await Product.create({
    name: name,
    slug: slugify(name, {
      lower: true,
    }),
    description: description,
    price: price,
    quantity: quantity,
    shiping: shiping,
    category: category,
    image: image,
  });

  return product;
};
/**
 * GET Products service
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const getProducts = async (page = 1, limit = 4, filter = {}) => {
  const products = await Product.find(filter)
    .populate("category")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  if (!products) {
    throw createError(404, "No products found");
  }
  const count = await Product.find(filter).countDocuments();

  return { products, count, totalPage: Math.ceil(count / limit) };
};
/**
 * GET Product service
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const getProduct = async (slug) => {
  const product = await Product.findOne({ slug }).populate("category");
  if (!product) {
    throw createError(404, "Not product found");
  }

  return product;
};
/**
 * DELETE Product service
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const deleteProduct = async (slug) => {
  const product = await Product.findOneAndDelete({ slug });
  if (!product) {
    throw createError(404, "No product found");
  }

  return product;
};
/**
 * PUT Product service
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const updateProduct = async (filter, data, image) => {
  const updateOptions = { new: true, runValidators, context: "query" };

  let updates = {};
  const allowedFeilds = [
    "name",
    "description",
    "price",
    "sold",
    "quantity",
    "shiping",
  ];
  for (const key in data) {
    if (allowedFeilds.includes(key)) {
      updates[key] = data[key];
    }
  }

  if (image) {
    // image size maximum 2 mb
    if (image.size > 1024 * 1024 * 2) {
      throw createError(400, "File too large, It must be less than 2 mb");
    }
    updates.image = image.buffer.toString("base64");
  }
  if (updates.name) {
    updates.slug = slugify(updates.name, {
      lower: true,
    });
  }

  const updateProduct = await Product.findOneAndUpdate(
    filter,
    updates,
    updateOptions
  ).populate("category");

  if (!updateProduct) {
    throw createError(404, "User this ID dose not axist!");
  }

  return updateProduct;
};
