import { BrowserRouter, Routes, Route } from "react-router";
import { LoginPage } from "./pages/login-page";
import { SignUpPage } from "./pages/signup-page";
import { ChatPage } from "./pages/chat-page";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/use-auth-store";

export function App() {
  const { authUser, isLoading, login } = useAuthStore();

  console.log("authUser", authUser);
  console.log("isLoading", isLoading);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
        <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>

        <Toaster />
      </div>
    </BrowserRouter>
  );
}
