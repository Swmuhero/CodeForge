import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(8).max(128)
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(8).max(128)
  })
});

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.validated.body;
    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id.toString());

    res.status(201).json({
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.validated.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id.toString());

    res.json({
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
}

export function logout(_req, res) {
  res.json({ message: "Logged out" });
}
