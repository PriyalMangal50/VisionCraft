import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
// import createError from "http-errors";
// import { createToken } from "../helpers/jsonwebtoken.js";
// import { errorResponse, successResponse } from "./response.controller.js";
// import { adminEmail, adminPassword, jwtSecret } from "../secret.js";
import jwt from "jsonwebtoken";

const createToken =(id) =>{
  return jwt.sign({id},process.env.JWT_SECRET)
}

//route for user register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    //check user already exists
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.json({success:false, message:"User already Registered"})
    }

    //validating email and strong password
    if (!validator.isEmail(email)) {
      return res.json({success:false, message:"Please enter a valid email"})
    }
    
    if (password.length < 8) {
      return res.json({success:false, message:"Password must be 8char+ "})
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      name,
      email,
      password: hashPassword,
    });

    const user = await newUser.save()
    
    //create token
    const token = createToken(user._id);
    res.json({success:true,token})
  } catch (error) {
    console.log(error);
    res.json({success:false, message: error.message})
    
  }
   
}

//route for user login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({success:false, message:"User does not exist"})
    }

    const isMatch = await  bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({success:true, token})
    }
    else{
      res.json({success:false, message:"Invalid Credentials"})
    }

  } catch (error) {
    res.json({success:false,message : error.message})
  }
};

////route for admin login
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({success:true,token})
    }
    else{
      res.json({success:false,message:"invalid Credentials"})
    }
  } catch (error) {
    res.json({success:false,message : error.message})
  }
};

export { registerUser, loginUser, adminLogin };

// ========== Profile endpoints ==========
// Get current user's profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update current user's profile (name, phone, avatar)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }
    const { name, phone, avatar } = req.body;
    const update = {};
    if (typeof name === "string") update.name = name;
    if (typeof phone === "string") update.phone = phone;
    if (typeof avatar === "string") update.avatar = avatar;
    const user = await userModel.findByIdAndUpdate(userId, update, { new: true }).select("-password");
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Add or update an address
export const upsertAddress = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Not Authorized" });
    const { _id, ...addr } = req.body.address || {};
    if (!addr) return res.status(400).json({ success: false, message: "No address provided" });

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (_id) {
      const idx = user.addresses.findIndex(a => String(a._id) === String(_id));
      if (idx === -1) return res.status(404).json({ success: false, message: "Address not found" });
      user.addresses[idx] = { ...user.addresses[idx].toObject(), ...addr };
    } else {
      user.addresses.push(addr);
    }

    // Ensure one default
    if (addr.isDefault) {
      user.addresses = user.addresses.map(a => ({ ...a.toObject(), isDefault: String(a._id) === String(_id) || a === user.addresses[user.addresses.length-1] }));
    }

    await user.save();
    const safeUser = await userModel.findById(userId).select("-password");
    return res.json({ success: true, user: safeUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an address
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Not Authorized" });
    const { id } = req.params;
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const before = user.addresses.length;
    user.addresses = user.addresses.filter(a => String(a._id) !== String(id));
    if (user.addresses.length === before) return res.status(404).json({ success: false, message: "Address not found" });
    await user.save();

    const safeUser = await userModel.findById(userId).select("-password");
    return res.json({ success: true, user: safeUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
