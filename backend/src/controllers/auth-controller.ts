import "dotenv/config";
import { User } from "@/database/models/user";
import { sendWelcomeEmail } from "@/email/emailHandlers";
import { generateToken } from "@/lib/jwt";
import { AppError } from "@/utils/app-error";
import { hash, compare } from "bcryptjs";
import { Request, Response } from "express";
import { z } from "zod";
import { cloudinary } from "@/lib/claudinary";

export class AuthController {
  // Signup
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

      // await sendWelcomeEmail(
      //   savedUser.email,
      //   savedUser.name,
      //   process.env.CLIENT_URL!
      // ).catch((error) => {
      //   console.log(error);
      // });

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

  // Login
  async login(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.email(),
      password: z.string(),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await User.findOne({ email });

    if (!user) return new Error("Invalid credential");

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) return new AppError("Invalid credential", 401);

    generateToken(user._id.toString(), response);

    return response.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePicture,
    });
  }

  // Logout
  async logout(request: Request, response: Response) {
    response.cookie("jwt", "", { maxAge: 0 });
    return response.status(200).json({ message: "Logged out successfully" });
  }

  // Update Profile
  async updateProfile(request: Request, response: Response) {
    const { profilePic } = z
      .object({
        profilePic: z.string(),
      })
      .parse(request.body);

    const userId = request.user?.id;
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePicture: uploadResponse.secure_url,
      },
      { new: true }
    );

    return response.json({
      user: updatedUser,
    });
  }
}
