"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersSummary = exports.updateProfile = exports.getAllUsers = exports.logout = exports.getCurrentUser = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const jwt_1 = require("../utils/jwt");
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await prisma_1.default.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: { name, email, password: hashedPassword },
        });
        res.status(201).json({ message: "User registered", user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        // console.log(req.body)
        const { email, password } = req.body;
        console.log(email);
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = (0, jwt_1.signToken)(user.id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
        res.json({ message: "Login successful", user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.login = login;
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch user",
        });
    }
};
exports.getCurrentUser = getCurrentUser;
const logout = async (_req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
        });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.logout = logout;
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        res.status(200).json({
            success: true,
            users,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllUsers = getAllUsers;
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, email, password, currentPassword } = req.body;
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        //  If email or password is being updated → verify current password
        if ((email || password) && !currentPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password is required",
            });
        }
        if (email || password) {
            const isMatch = await bcrypt_1.default.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Current password is incorrect",
                });
            }
        }
        const updatedData = {};
        if (name)
            updatedData.name = name;
        if (email)
            updatedData.email = email;
        if (password) {
            updatedData.password = await bcrypt_1.default.hash(password, 10);
        }
        const updatedUser = await prisma_1.default.user.update({
            where: { id: userId },
            data: updatedData,
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update profile",
        });
    }
};
exports.updateProfile = updateProfile;
const getUsersSummary = async (req, res) => {
    try {
        const today = new Date();
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                _count: {
                    select: {
                        tasksCreated: true,
                        tasksAssigned: true,
                    },
                },
                tasksAssigned: {
                    select: {
                        dueDate: true,
                        status: true,
                    },
                },
            },
        });
        const formattedUsers = users.map((user) => {
            const overdueTasks = user.tasksAssigned.filter((task) => task.dueDate < today && task.status !== "Completed").length;
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                tasksCreated: user._count.tasksCreated,
                tasksAssigned: user._count.tasksAssigned,
                overdueTasks,
            };
        });
        res.status(200).json({
            success: true,
            users: formattedUsers,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getUsersSummary = getUsersSummary;
