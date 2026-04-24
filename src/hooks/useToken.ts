"use server";
import { cookies, headers } from "next/headers";

export const useToken = async () => {
  const cookieStore = await cookies();
  const header = await headers();
  const token =
    cookieStore.get("token")?.value ||
    header.get("Authorization")?.split(" ")[1];
  return token;
};
