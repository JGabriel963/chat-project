import { Socket } from "socket.io";

declare module "socket.io" {
  interface Socket {
    user?: {
      id: string;
      name: string;
      email: string;
      profilePicture: string;
    };
    userId?: string;
  }
}
