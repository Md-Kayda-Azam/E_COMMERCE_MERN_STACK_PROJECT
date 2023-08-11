import createError from "http-errors";
import User from "../models/modelUser.js";
import jwt from "jsonwebtoken";
import { successRespone } from "../helper/respone.js";
import { findWithId } from "../services/findItem.js";
import { deleteImage } from "../helper/deleteImage.js";
import { createJSONWebToken } from "../helper/jsonwebtoken.js";
import { cleint_url, jwtActivationKey } from "../scret.js";
import { emailWithNodeMailer } from "../helper/email.js";

/**
 * GET Users
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };

    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!users) throw createError(404, "no user found");

    return successRespone(res, {
      statusCode: 200,
      message: "User were retuened successfully",
      payload: {
        users,
        pagination: {
          totalPage: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page - 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET Single user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    return successRespone(res, {
      statusCode: 200,
      message: "User were retuened successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};
/**
 * DELETE User
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };

    const user = await findWithId(User, id, options);

    const userImagePath = user.image;

    deleteImage(userImagePath);

    await User.findByIdAndDelete({ _id: id, isAdmin: false });

    return successRespone(res, {
      statusCode: 200,
      message: "User were retuened successfully",
    });
  } catch (error) {
    next(error);
  }
};
/**
 * Prosecc registration
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const proseccRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const userExsits = await User.exists({ email: email });

    if (userExsits) {
      throw createError(
        409,
        "User with this email already axists. Please sign in"
      );
    }

    // create jwt
    const token = createJSONWebToken(
      { name, email, password, phone, address },
      jwtActivationKey,
      "10m"
    );

    // prepare email

    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `
      <h2> Hello ${name} !</h2>
      <p>Please click here to <a href="${cleint_url}/api/users/activate/${token}" target="_blank">activate your account</a></p>
      `,
    };

    // send email with nodemailer
    try {
      await emailWithNodeMailer(emailData);
    } catch (error) {
      next(createError("Faild to send verification email"));
      return;
    }

    return successRespone(res, {
      statusCode: 200,
      message: `Please got to your ${email} for completing your registration process`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};
/**
 * Activate user account
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;

    if (!token) throw createError(404, "Token not found");

    try {
      const decoded = jwt.verify(token, jwtActivationKey);

      if (!decoded) throw createError(401, "User was not able to verified");
      const userExsits = await User.exists({ email: decoded.email });

      if (userExsits) {
        throw createError(
          409,
          "User with this email already axists. Please sign in"
        );
      }

      await User.create(decoded);

      return successRespone(res, {
        statusCode: 200,
        message: `User was registered successfully`,
      });
    } catch (error) {
      if (error.name == "TokenExpiredError") {
        throw createError(404, "Token has expired");
      } else if (error.name == "JsonWebTokenError") {
        throw createError(404, "Invalid Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};
