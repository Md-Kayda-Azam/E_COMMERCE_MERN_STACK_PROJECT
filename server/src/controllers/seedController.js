import { data } from "../../data.js";
import User from "../models/modelUser.js";

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
