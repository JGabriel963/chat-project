import { useForm } from "react-hook-form";
import { loginSchema, type LoginSchema } from "../http/schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../store/use-auth-store";
import { useTransition } from "react";
import {
  LoaderIcon,
  LockIcon,
  MailIcon,
  MessageCircleIcon,
} from "lucide-react";
import { Link } from "react-router";

export function LoginPage() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const { login } = useAuthStore();
  const [isLogginIn, setIsLogginIn] = useTransition();

  function handleSignUp(data: LoginSchema) {
    setIsLogginIn(async () => {
      await login(data);
    });
  }

  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full  max-w-6xl md:h-[800px] h-[650px]">
        <div className="w-full h-full bg-gray-900 flex flex-col md:flex-row">
          {/* LEFT SIDE */}
          <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
            <div className="w-full max-w-md">
              {/* HEADING TEXT */}
              <div className="text-center mb-8">
                <MessageCircleIcon className="size-12 mx-auto text-slate-400" />
                <h2 className="text-2xl font-bold text-slate-200 mt-4">
                  Bem-vindo de volta!
                </h2>
                <p className="text-slate-400 mt-2">
                  Entrar para continuar com sua conta
                </p>
              </div>

              {/* FORM */}
              <form
                onSubmit={form.handleSubmit(handleSignUp)}
                className="space-y-6"
              >
                <div>
                  <label className="auth-input-label">Email</label>
                  <div className="relative">
                    <MailIcon className="auth-input-icon" />

                    <input
                      type="email"
                      {...form.register("email")}
                      className="input"
                      placeholder="johndoe@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="auth-input-label">Password</label>
                  <div className="relative">
                    <LockIcon className="auth-input-icon" />

                    <input
                      type="password"
                      {...form.register("password")}
                      className="input"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  className="auth-btn cursor-pointer"
                  type="submit"
                  disabled={isLogginIn}
                >
                  {isLogginIn ? (
                    <LoaderIcon className="w-full h-5 animate-spin text-center" />
                  ) : (
                    "Entrar"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/signup" className="auth-link">
                  Já tenho uma conta? Entrar
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
            <div>
              <img
                src="/login.png"
                alt="People using mobile devices"
                className="w-full h-auto object-contain"
              />
              <div className="mt-6 text-center">
                <h3 className="text-xl font-medium text-cyan-400">
                  Conecte-se qualquer hora e em qualquer lugar
                </h3>

                <div className="mt-4 flex justify-center gap-4">
                  <span className="auth-badge">Seguro</span>
                  <span className="auth-badge">Rápido</span>
                  <span className="auth-badge">Private</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
