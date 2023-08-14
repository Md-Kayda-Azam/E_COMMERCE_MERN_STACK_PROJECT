import createError from "http-errors";
import User from "../models/modelUser.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { successRespone } from "../helper/respone.js";
import { findWithId } from "../services/findItem.js";
import { createJSONWebToken } from "../helper/jsonwebtoken.js";
import { cleint_url, jwtActivationKey, jwtResetPasswordKey } from "../scret.js";
import { emailWithNodeMailer } from "../helper/email.js";
import { runValidators } from "../validators/index.js";
import { checkUserExist } from "../helper/checkUserExist.js";
import { sendEmail } from "../helper/sendEmail.js";

/**
 * GET Users
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleGetUsers = async (req, res, next) => {
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
    console.log(error);
  }
};

/**
 * GET Single user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleGetUserById = async (req, res, next) => {
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
export const handleDeleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };

    await findWithId(User, id, options);

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
export const handleProseccRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    let image = req.file;
    if (!image) {
      throw createError(400, "Image file is required");
    }
    if (image > 1024 * 1024 * 2) {
      throw createError(400, "File too large, It must be less than 2 mb");
    }

    const imageBufferString = req.file.buffer.toString("base64");

    const userExsits = await checkUserExist(email);

    if (userExsits) {
      throw createError(
        409,
        "User with this email already axists. Please sign in"
      );
    }

    // create jwt
    const token = createJSONWebToken(
      { name, email, password, phone, address, image: imageBufferString },
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
    sendEmail(emailData);

    return successRespone(res, {
      statusCode: 200,
      message: `Please got to your ${email} for completing your registration process`,
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
export const handleActivateUserAccount = async (req, res, next) => {
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
/**
 * User update
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleUpdateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const options = { password: 0 };
    await findWithId(User, userId, options);
    const updateOptions = { new: true, runValidators, context: "query" };

    let updates = {};
    // name, email, password, phone, image, address
    const allowedFeilds = ["name", "email", "password", "phone", "address"];
    for (const key in req.body) {
      if (allowedFeilds.includes(key)) {
        updates[key] = req.body[key];
      }
      if (key === "email") {
        throw createError(400, "Email can not be allowed!");
      }
    }

    let image = req.file;
    if (image) {
      // image size maximum 2 mb
      if (image.size > 1024 * 1024 * 2) {
        throw createError(400, "File too large, It must be less than 2 mb");
      }
      updates.image = image.buffer.toString("base64");
    }

    const updateUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("_password");

    if (!updateUser) {
      throw createError(404, "User this ID dose not axist!");
    }

    return successRespone(res, {
      statusCode: 200,
      message: "User was updated successfully",
      payload: updateUser,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * handle Ban User By Id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleBanUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithId(User, userId);
    const update = { isBanned: true };
    const updateOptions = { new: true, runValidators, context: "query" };

    const updateUser = await User.findByIdAndUpdate(
      userId,
      update,
      updateOptions
    ).select("_password");

    if (!updateUser) {
      throw createError(404, "User was not banned successfully!");
    }

    return successRespone(res, {
      statusCode: 200,
      message: "User was banned successfully",
    });
  } catch (error) {
    next(error);
  }
};
/**
 * handle unBan User By Id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleUnbanUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithId(User, userId);
    const update = { isBanned: false };
    const updateOptions = { new: true, runValidators, context: "query" };

    const updateUser = await User.findByIdAndUpdate(
      userId,
      update,
      updateOptions
    ).select("_password");

    if (!updateUser) {
      throw createError(404, "User was not unbanned successfully!");
    }

    return successRespone(res, {
      statusCode: 200,
      message: "User was unbanned successfully",
    });
  } catch (error) {
    next(error);
  }
};
/**
 * update password
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleUpdatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const userId = req.params.id;
    const user = await findWithId(User, userId);

    // Compare the password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      throw new Error("Old Password is incurrect");
    }
    // const update = { $set: { password: newPassword } };
    // const updateOptions = { new: true };

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true }
    ).select("_password");

    if (!updateUser) {
      throw createError(404, "User was not password update successfully!");
    }

    return successRespone(res, {
      statusCode: 200,
      message: "User was password updated successfully",
      payload: { updateUser },
    });
  } catch (error) {
    next(error);
  }
};
/**
 * update password
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleUpdateForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // const userId = req.params.id;
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error(
        "Email is incurrect or you have not verified your email address. Please register yourseft first"
      );
    }
    // create jwt
    const token = createJSONWebToken({ email }, jwtResetPasswordKey, "10m");
    // prepare email

    const emailData = {
      email,
      subject: "Reset password email",
      html: `
      <h2> Hello ${user.name} !</h2>
      <p>Please click here to <a href="${cleint_url}/api/users/reset-password/${token}" target="_blank">reset your password</a></p>
      `,
    };

    // send email with nodemailer
    sendEmail(emailData);

    return successRespone(res, {
      statusCode: 200,
      message: `Please got to your ${email} to reset the password`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};
/**
 * update password
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const handleUpdateResetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const decoded = jwt.verify(token, jwtResetPasswordKey);

    if (!decoded) {
      throw createError(400, "Invalid or expried token");
    }
    const filter = { email: decoded.email };
    const update = { password: password };
    const options = { new: true };
    const updateUser = await User.findOneAndUpdate(
      filter,
      update,
      options
    ).select("_password");

    if (!updateUser) {
      throw createError(404, "User was not password update successfully!");
    }
    return successRespone(res, {
      statusCode: 200,
      message: `Password reset successfully`,
    });
  } catch (error) {
    next(error);
  }
};
