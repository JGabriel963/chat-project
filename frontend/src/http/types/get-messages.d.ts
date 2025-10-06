type Messages = {
  _id: string;
  senderId: string;
  receiverId: string;
  image: string;
  text: string;
  createdAt: string;
};

type GetMessagesResponse = {
  messages: Messages[];
};

type SendMessageResponse = {
  newMessage: Messages;
};
