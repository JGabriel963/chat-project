import { useKeyboardSound } from "../hooks/use-keyboard-sound";

export function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  return <div>MessageInput</div>;
}
