import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Optional profile fields
    phone: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    addresses: [
      new mongoose.Schema(
        {
          fullName: { type: String, default: "" },
          line1: { type: String, default: "" },
          line2: { type: String, default: "" },
          city: { type: String, default: "" },
          state: { type: String, default: "" },
          postalCode: { type: String, default: "" },
          country: { type: String, default: "India" },
          phone: { type: String, default: "" },
          isDefault: { type: Boolean, default: false },
        },
        { _id: true }
      ),
    ],
    role: {
      type: String,
      enum: ["customer", "admin", "manager", "editor", "support"],
      default: "customer",
    },
    permissions: {
      products: {
        view: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      },
      orders: {
        view: { type: Boolean, default: false },
        process: { type: Boolean, default: false },
        refund: { type: Boolean, default: false },
      },
      users: {
        view: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      },
      content: {
        view: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      },
      reports: {
        view: { type: Boolean, default: false },
      }
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    cartData: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true, minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel
