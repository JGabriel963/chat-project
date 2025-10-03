import "dotenv/config";
import { User } from "@/database/models/user";
import { sendWelcomeEmail } from "@/email/emailHandlers";
import { generateToken } from "@/lib/jwt";
import { AppError } from "@/utils/app-error";
import { hash } from "bcryptjs";
import { Request, Response } from "express";
import { z } from "zod";

export class AuthController {
  async signup(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string(),
      email: z.email(),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const user = await User.findOne({ email });

    if (user) {
      throw new AppError("User already exists");
    }

    const passwordHash = await hash(password, 8);

    const newUser = await User.create({
      name,
      email,
      password: passwordHash,
    });

    if (newUser) {
      const savedUser = await newUser.save();
      generateToken(newUser._id.toString(), response);

      await sendWelcomeEmail(
        savedUser.email,
        savedUser.name,
        process.env.CLIENT_URL!
      ).catch((error) => {
        console.log(error);
      });

      return response.status(201).json({
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        profilePicture: savedUser.profilePicture,
      });
    }

    return response.status(400).json({
      message: "Invalid user data",
    });
  }
  async login(request: Request, response: Response) {
    //
  }
  async logout(request: Request, response: Response) {
    //
  }
}
