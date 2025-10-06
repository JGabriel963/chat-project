import "dotenv/config";
import { ExtendedError, type Socket } from "socket.io";
import { verify } from "jsonwebtoken";
import { User } from "@/database/models/user";

type Payload = {
  userId: string;
};

export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt"))
      ?.split("=")[1];

    if (!token) {
      return next(new Error("Unauthorized - No Token Provided"));
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as Payload;
    if (!decoded) return next(new Error("Unauthorized - Invalid Token"));

    const user = await User.findById(decoded.userId);

    if (!user) return next(new Error("User not found"));

    // attach user info to socket
    socket.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    };
    socket.userId = user._id.toString();

    return next();
  } catch (error) {
    console.log("Error in socket authentication:", error);
    next(new Error("Unauthorized - Invalid Token"));
  }
};
