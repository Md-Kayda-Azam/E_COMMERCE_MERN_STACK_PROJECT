import mongoose, { Schema } from "mongoose";

// name, slug, description, price, quantity, sold, shiping, image
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is missing"],
      trim: true,
      minlength: [
        3,
        "The length name of Product name can be minimum 3 character ",
      ],
      maxlength: [
        150,
        "The length name of Product name can be maximum 150 character ",
      ],
    },
    slug: {
      type: String,
      required: [true, "Slug name is missing"],
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Product description is requied"],
      trim: true,
      minlength: [
        3,
        "The length name of Product description can be minimum 3 character ",
      ],
    },
    price: {
      type: Number,
      required: [true, "Product price is requied"],
      trim: true,
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: (props) =>
          `${props} is not valid price! Price must be generate than 0`,
      },
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is requied"],
      trim: true,
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: (props) =>
          `${props} is not valid price quantity! Price quantity must be generate than 0`,
      },
    },
    sold: {
      type: Number,
      required: [true, "Sold is requied"],
      trim: true,
      default: 0,
    },
    shiping: {
      type: Number,
      default: 0, // shiping free0 orpaid something amount
    },
    image: {
      type: Buffer,
      contentType: String,
      required: [true, "Product image is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
