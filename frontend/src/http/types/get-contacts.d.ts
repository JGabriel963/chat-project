type Contact = {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
};

type GetContactsResponse = {
  contacts: Contact[];
};

type GetChatsResponse = {
  chatPartners: Contact[];
};
