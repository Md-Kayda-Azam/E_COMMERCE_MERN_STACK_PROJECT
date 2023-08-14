import createError from "http-errors";
import { successRespone } from "../helper/respone.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../services/product.js";

/**
 * POST --> /api/products --> create product
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleCreateProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, shiping, category } = req.body;

    let image = req.file;
    if (!image) {
      throw createError(400, "Image file is required");
    }
    if (image > 1024 * 1024 * 2) {
      throw createError(400, "File too large, It must be less than 2 mb");
    }

    const imageBufferString = req.file.buffer.toString("base64");

    const productData = {
      name,
      description,
      price,
      quantity,
      shiping,
      category,
      image: imageBufferString,
    };

    const product = await createProduct(productData);

    return successRespone(res, {
      statusCode: 200,
      message: `Product was created successfully`,
      payload: product,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
/**
 * GET --> /api/products --> read products
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleGetProducts = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 4);

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      $or: [{ name: { $regex: searchRegExp } }],
    };
    const productsData = await getProducts(page, limit, filter);

    return successRespone(res, {
      statusCode: 200,
      message: `retuned all the products`,
      payload: {
        products: productsData.products,
        pagination: {
          totalPage: productsData.totalPage,
          currentPage: page,
          previousPage: page - 1,
          nextPage: page + 1,
          totalNumberOfProducts: productsData.count,
        },
      },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
/**
 * GET --> /api/product/:slug --> single read product
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleGetProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await getProduct(slug);

    return successRespone(res, {
      statusCode: 200,
      message: `retuned single product`,
      payload: { product },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
/**
 * DELETE --> /api/product/:slug --> delete product
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleDeleteProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    await deleteProduct(slug);

    return successRespone(res, {
      statusCode: 200,
      message: `Product delete successfully`,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
/**
 * UPDATE --> /api/product/:slug --> update product
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleUpdateProduct = async (req, res, next) => {
  try {
    const { filter } = req.params.slug;
    const data = req.body;
    let image = req.file;

    const updateProductData = await updateProduct(filter, data, image);

    return successRespone(res, {
      statusCode: 200,
      message: "Product was updated successfully",
      payload: updateProductData,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};
