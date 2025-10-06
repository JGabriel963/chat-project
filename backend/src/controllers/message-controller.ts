import { Message } from "@/database/models/message";
import { User } from "@/database/models/user";
import { cloudinary } from "@/lib/claudinary";
import { getReceiverSocketId, io } from "@/lib/socket";
import { AppError } from "@/utils/app-error";
import { Request, Response } from "express";
import { z } from "zod";

export class MessageController {
  async sendMessage(request: Request, response: Response) {
    const senderId = request.user?.id;
    const { text, image } = request.body as { text?: string; image?: string };
    const { id: receiverId } = z
      .object({
        id: z.string(),
      })
      .parse(request.params);

    if (!text && !image) {
      throw new AppError("Text or image is required");
    }

    if (senderId?.toString() === receiverId.toString()) {
      throw new AppError("You cannot send a message to yourself");
    }

    const receiverExists = await User.exists({ _id: receiverId });

    if (!receiverExists) {
      throw new AppError("Receiver does not exist");
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // todo: send message in real-time if user is online - socket.io
    const receiverScoketId = getReceiverSocketId(receiverId);

    if (receiverScoketId) {
      io.to(receiverScoketId).emit("newMessage", newMessage);
    }

    return response.json({
      newMessage,
    });
  }

  async getMessagesByUserId(request: Request, response: Response) {
    const userId = request.user?.id;
    const { id: userToChatId } = z
      .object({
        id: z.string(),
      })
      .parse(request.params);

    // me and you
    // i send you the message
    // you send me the message

    const message = await Message.find({
      $or: [
        { senderId: userId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: userId },
      ],
    });

    return response.json({
      messages: message,
    });
  }

  async getAllContacts(request: Request, response: Response) {
    const loggerdInUserId = request.user?.id;

    const filterdUsers = await User.find({
      _id: { $ne: loggerdInUserId },
    }).select("-password");

    return response.json({
      contacts: filterdUsers,
    });
  }

  async getChatPartners(request: Request, response: Response) {
    const loggerdInUserId = request.user?.id;

    // find all the messages where the logged-in user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggerdInUserId }, { receiverId: loggerdInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggerdInUserId?.toString()
            ? msg.receiverId
            : msg.senderId
        )
      ),
    ];

    console.log(chatPartnerIds);

    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password");

    return response.json({
      chatPartners,
    });
  }
}
