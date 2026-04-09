import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../services/auth.service";
import crypto from "crypto";
import { sendVerificationEmail } from "../services/mail.service";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  if (!user.password) {
  return res.status(400).json({ message: "Invalid user data" });
}

if (!user.isVerified) {
  return res.status(403).json({
    message: "Please verify your email first",
  });
}
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
  });

  res.json({
    accessToken,
    user: { id: user._id, role: user.role, email: user.email }
  });
};

import jwt from "jsonwebtoken";

export const refresh = (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.sendStatus(401);

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);

    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });

  } catch {
    res.sendStatus(403);
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔐 Generate verification token
    const token = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",

      // 🔽 ADD THESE
      isVerified: false,
      verificationToken: token,
      verificationTokenExpires: new Date(Date.now() + 3600000), // 1 hour
    });

    // 📧 Send email
    await sendVerificationEmail(email, token);

    // ❗ DO NOT LOGIN USER HERE
    res.status(201).json({
      message: "Registration successful. Please verify your email.",
    });

  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.json({ message: "Email verified successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req: any, res: any) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};


