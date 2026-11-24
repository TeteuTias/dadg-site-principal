import { redirect } from "next/navigation";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function EntrarPage({ searchParams }: Props) {
  const authRequest = (await searchParams).authRequest;
  redirect(typeof authRequest === "string" ? `/entrar/login?authRequest=${encodeURIComponent(authRequest)}` : "/entrar/login");
}
