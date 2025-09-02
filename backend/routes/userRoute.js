import express from "express";
import{loginUser,registerUser,adminLogin, getProfile, updateProfile, upsertAddress, deleteAddress} from "../controllers/userController.js";
import authUser from "../middleware/Auth.js";

const userRouter = express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.post("/admin",adminLogin);

// profile routes
userRouter.get("/profile", authUser, getProfile);
userRouter.put("/profile", authUser, updateProfile);
userRouter.post("/address", authUser, upsertAddress);
userRouter.delete("/address/:id", authUser, deleteAddress);

export default userRouter;