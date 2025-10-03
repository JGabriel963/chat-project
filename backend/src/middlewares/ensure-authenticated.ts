import { User } from "@/database/models/user";
import { AppError } from "@/utils/app-error";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

type Payload = {
  userId: string;
};

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const token = request.cookies.jwt;

    if (!token)
      return response
        .status(401)
        .json({ message: "Unauthorized - No token provided" });

    const decoded = verify(token, process.env.JWT_SECRET!) as Payload;

    if (!decoded)
      return response
        .status(401)
        .json({ message: "Unauthorized - Invalid token" });

    const user = await User.findById(decoded.userId);

    if (!user) return response.status(401).json({ message: "User not found" });

    request.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    };

    return next();
  } catch (error) {
    throw new AppError("Invalid token", 401);
  }
}
