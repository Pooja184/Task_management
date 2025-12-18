import { Router } from "express";
import { getCurrentUser, login, logout, register } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";


const authRouter=Router();

authRouter.post("/register",register);
authRouter.post("/login",login)
authRouter.post("/logout",logout)
authRouter.get("/profile",protect,getCurrentUser)

export default authRouter