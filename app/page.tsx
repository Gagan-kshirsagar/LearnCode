import { onBoardUser } from "@/modules/auth/action";

export default async function Home() {
  await onBoardUser();
  return <></>;
}
