import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // prevent XSS attacks: cross-site scripting
    sameSite: "none", // prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development", // only send over HTTPS in production
  });

  return token;
};
