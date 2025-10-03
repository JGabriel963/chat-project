type Props = {
  title: string;
};

export function Button({ title }: Props) {
  return <button>{title}</button>;
}
