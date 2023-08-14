import createError from "http-errors";
import User from "../models/modelUser.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { successRespone } from "../helper/respone.js";
import { createJSONWebToken } from "../helper/jsonwebtoken.js";
import { jwtAccessTokenKey, jwtRefreshTokenKey } from "../scret.js";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../helper/cookie.js";

/**
 * User Login
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleLogin = async (req, res, next) => {
  try {
    // email, password req.body
    const { email, password } = req.body;
    // isExist
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not axist with this email. Please register first");
    }
    // Compare the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new Error("Email/Password did not match");
    }
    // isBanned
    if (user.isBanned) {
      throw new Error("You are banned. Please contact Authority");
    }
    // token cookie
    // create jwt
    const accessToken = createJSONWebToken({ user }, jwtAccessTokenKey, "15m");

    setAccessTokenCookie(res, accessToken);
    // create jwt
    const refreshToken = createJSONWebToken(
      { user },
      jwtRefreshTokenKey,
      "15m"
    );

    setRefreshTokenCookie(res, refreshToken);
    const userWithOutPassword = await user.toObject();

    delete userWithOutPassword.password;
    // successful reponse
    return successRespone(res, {
      statusCode: 200,
      message: "User was loggedIn successfully",
      payload: userWithOutPassword,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * User Logout
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    // successful reponse
    return successRespone(res, {
      statusCode: 200,
      message: "User was logged out successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};
/**
 * handle Refresh Token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const decoded = jwt.verify(refreshToken, jwtRefreshTokenKey);

    if (!decoded) {
      throw createError(401, "Invalid refresh token. Please login again");
    }
    const accessToken = createJSONWebToken(
      decoded.user,
      jwtAccessTokenKey,
      "5m"
    );

    setAccessTokenCookie(res, accessToken);
    // successful reponse
    return successRespone(res, {
      statusCode: 200,
      message: "New access token generated",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};
/**
 * handle Protected Route
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleProtectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    const decoded = jwt.verify(accessToken, jwtAccessTokenKey);

    if (!decoded) {
      throw createError(401, "Invalid access token. Please login again");
    }

    // successful reponse
    return successRespone(res, {
      statusCode: 200,
      message: "Protected resources accessed successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};
