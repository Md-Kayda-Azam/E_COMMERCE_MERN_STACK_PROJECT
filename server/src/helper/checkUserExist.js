import User from "../models/modelUser.js";
import Product from "../routers/produtRouter.js";

export const checkUserExist = async (email) => {
  return await User.exists({ email: email });
};
