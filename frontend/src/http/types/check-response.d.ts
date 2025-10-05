interface UserCheckResponse {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
}

interface UserUploadProfileResponse {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
}

interface UploadProfileResponse {
  user: UserUploadProfileResponse;
}
