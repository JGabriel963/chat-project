import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpSchema } from "../http/schemas/signup";
import { useAuthStore } from "../store/use-auth-store";
import { useTransition } from "react";
import {
  LoaderIcon,
  LockIcon,
  MailIcon,
  MessageCircleIcon,
  UserIcon,
} from "lucide-react";
import { Link } from "react-router";

export function SignUpPage() {
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });
  const { signUp } = useAuthStore();
  const [isSigningUp, setIsSigningUp] = useTransition();

  function handleSignUp(data: SignUpSchema) {
    setIsSigningUp(async () => {
      await signUp(data);
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
                  Criar uma conta
                </h2>
                <p className="text-slate-400 mt-2">
                  Cadastre-se para criar uma conta
                </p>
              </div>

              {/* FORM */}
              <form
                onSubmit={form.handleSubmit(handleSignUp)}
                className="space-y-6"
              >
                <div>
                  <label className="auth-input-label">Nome</label>
                  <div className="relative">
                    <UserIcon className="auth-input-icon" />
                    <input
                      type="text"
                      {...form.register("name")}
                      className="input"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
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
                  disabled={isSigningUp}
                >
                  {isSigningUp ? (
                    <LoaderIcon className="w-full h-5 animate-spin text-center" />
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="auth-link">
                  Already have an account? Login
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
            <div>
              <img
                src="/signup.png"
                alt="People using mobile devices"
                className="w-full h-auto object-contain"
              />
              <div className="mt-6 text-center">
                <h3 className="text-xl font-medium text-cyan-400">
                  Start Your Journey Today
                </h3>

                <div className="mt-4 flex justify-center gap-4">
                  <span className="auth-badge">Free</span>
                  <span className="auth-badge">Easy Setup</span>
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
