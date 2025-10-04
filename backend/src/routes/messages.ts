import { MessageController } from "@/controllers/message-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { Router } from "express";

const messageRoutes = Router();
const messageController = new MessageController();

messageRoutes.use(ensureAuthenticated);

messageRoutes.get("/contacts", messageController.getAllContacts);
messageRoutes.get("/chats", messageController.getChatPartners);
messageRoutes.get("/:id", messageController.getMessagesByUserId);
messageRoutes.post("/send/:id", messageController.sendMessage);

export { messageRoutes };
