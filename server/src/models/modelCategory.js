import mongoose, { Schema } from "mongoose";

// name, slug
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is missing"],
      trim: true,
      unique: true,
      minlength: [
        3,
        "The length name of Category name can be minimum 3 character ",
      ],
    },
    slug: {
      type: String,
      required: [true, "Slug name is missing"],
      lowercase: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
