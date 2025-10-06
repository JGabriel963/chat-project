import "dotenv/config";
import { AppError } from "@/utils/app-error";
import { NextFunction } from "express";
import { Socket } from "socket.io";
import { verify } from "jsonwebtoken";
import { User } from "@/database/models/user";

type Payload = {
  userId: string;
};

export const soocketAuthMiddleware = async (
  socket: Socket,
  next: NextFunction
) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt"))
      ?.split("=")[1];

    if (!token) {
      return next(new AppError("Unauthorized - No Token Provided"));
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as Payload;
    if (!decoded) return next(new AppError("Unauthorized - Invalid Token"));

    const user = await User.findById(decoded.userId);

    if (!user) return next(new AppError("User not found"));

    socket.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    };
  } catch (error) {}
};
