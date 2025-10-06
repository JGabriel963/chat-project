declare module "socket.io" {
  export interface Socket {
    user?: {
      id: string;
      name: string;
      email: string;
      profilePicture: string;
    };
  }
}
