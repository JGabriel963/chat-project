import "dotenv/config";
import { connectDB } from "./lib/mongo";
import { server } from "./lib/socket";

const PORT = process.env.PORT || 3333;

server.listen(PORT, () => {
  console.log("Server is running");
  connectDB();
});
