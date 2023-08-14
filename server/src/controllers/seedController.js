import { data } from "../../data.js";
import User from "../models/modelUser.js";
import Product from "../models/modelProduct.js";

/**
 * Seed GET All Users
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const seedGetAllUsers = async (req, res, next) => {
  try {
    // deleting all axisting user
    await User.deleteMany({});

    // inserting new user

    const users = await User.insertMany(data.users);

    // successfull respone
    res.status(201).json({
      users,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * Seed GET All Products
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const seedGetAllProducts = async (req, res, next) => {
  try {
    // deleting all axisting user
    await Product.deleteMany({});

    // inserting new user

    const products = await Product.insertMany(data.products);

    // successfull respone
    res.status(201).json({
      products,
    });
  } catch (error) {
    next(error);
  }
};
