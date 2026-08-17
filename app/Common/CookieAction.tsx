"use server";
import { cookies } from "next/headers";

export async function toggleModal() {
  const cookieStore = await cookies();

  const current = cookieStore.get("showModal")?.value === "true";

  cookieStore.set( "showModal", String(!current));
}