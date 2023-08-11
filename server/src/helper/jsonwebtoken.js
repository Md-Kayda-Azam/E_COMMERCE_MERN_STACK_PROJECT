import jwt from "jsonwebtoken";

export const createJSONWebToken = (payload, scretKey, expiresIn = "5m") => {
  if (typeof payload != "object" || !payload) {
    throw new Error("Payload must be as non-empty object");
  }
  if (typeof scretKey != "string" || scretKey === "") {
    throw new Error("ScretKey must be as non-empty string");
  }

  try {
    const token = jwt.sign(payload, scretKey, { expiresIn });
    return token;
  } catch (error) {
    console.error("Faild to sign the JWT", error);
    throw error;
  }
};
