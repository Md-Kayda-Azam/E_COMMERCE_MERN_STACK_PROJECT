import fs from "fs";
export const deleteImage = async (userImagePath) => {
  try {
    await fs.unlink(userImagePath);
    await fs.unlink(userImagePath);
    console.log("User image was deteled");
  } catch (error) {
    console.error("User image does not axist");
  }
};
