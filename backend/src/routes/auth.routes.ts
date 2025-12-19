import { Router } from "express";
import { getAllUsers, getCurrentUser, getUsersSummary, login, logout, register, updateProfile } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";


const authRouter=Router();

authRouter.post("/register",register);
authRouter.post("/login",login)
authRouter.post("/logout",logout)
authRouter.get("/profile",protect,getCurrentUser)
authRouter.get("/all-users",protect,getAllUsers)
authRouter.put("/profile",protect,updateProfile)
authRouter.get("/summary",protect,getUsersSummary)

export default authRouter