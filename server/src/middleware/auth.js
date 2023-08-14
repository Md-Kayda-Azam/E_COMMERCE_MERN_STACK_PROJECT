import createError from "http-errors";
import jwt from "jsonwebtoken";
import { jwtAccessTokenKey } from "../scret.js";
import { successRespone } from "../helper/respone.js";

/**
 * isLoaggedIn
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const isLoggedIn = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw new Error("Access Token not found. Please login first.");
    }

    const decoded = jwt.verify(accessToken, jwtAccessTokenKey);
    if (!decoded) {
      throw new Error("Invalid access token. Please login again");
    }

    req.user = decoded.user;

    next();
  } catch (error) {
    next(error);
  }
};
/**
 * isLoggedOut
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const isLoggedOut = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (accessToken) {
      throw new Error("User is already loggedIn");
    }

    next();
  } catch (error) {
    next(error);
  }
};
/**
 * isLoggedOut
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw new Error("Foridden. you must be an admin to access this resource");
    }
    next();
  } catch (error) {
    next(error);
  }
};
