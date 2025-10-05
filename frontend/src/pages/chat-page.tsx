import { useAuthStore } from "../store/use-auth-store";

export function ChatPage() {
  const { logout } = useAuthStore();
  return (
    <div className="flex flex-col relative">
      ChatPage
      <button onClick={() => logout()} className="btn-primary cursor-pointer">
        Sair
      </button>
    </div>
  );
}
