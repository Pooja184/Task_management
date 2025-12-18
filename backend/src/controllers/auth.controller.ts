import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma";
import { signToken } from "../utils/jwt";
import { success } from "zod";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
  
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
  
    res.status(201).json({ message: "User registered", user });
  } catch (error:any) {
    res.status(500).json({success:false,message:error.message})
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // console.log(req.body)
    const { email, password } = req.body;
    console.log(email)
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  
    const token = signToken(user.id);
  
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
  
    res.json({ message: "Login successful", user });
  } catch (error:any) {
    res.status(500).json({success:false,message:error.message})
    
  }
};


export const logout = async (_req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error:any) {
    return res.status(500).json({
      success: false,
      message:error.message,
    });
  }
};
