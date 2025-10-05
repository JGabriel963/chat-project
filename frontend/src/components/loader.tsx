import { Loader2 } from "lucide-react";

export function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}
