"use server";

import { revalidatePath } from "next/cache";

export async function revalidateSubscriptions() {
  // Revalidate the subscriptions page across all locales
  revalidatePath("/[lang]/dashboard/subscriptions", "page");
}
