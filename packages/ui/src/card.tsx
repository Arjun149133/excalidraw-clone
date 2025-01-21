import { type JSX } from "react";

export function Card({ title }: { title: string }): JSX.Element {
  return <div className=" ui-bg-yellow-400">Card {title}</div>;
}
