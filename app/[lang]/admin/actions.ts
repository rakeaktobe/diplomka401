"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Database } from "@/lib/database.types";

// --- USER ACTIONS ---

export async function updateUserBalance(userId: string, amount: number) {
  const supabase = (await createClient()) as any;

  // 1. Get current balance
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", userId)
    .single();

  if (fetchError || !profile) {
    return { error: "Пользователь не найден" };
  }

  const currentBalance = profile.balance || 0;
  const newBalance = currentBalance + amount;

  // 2. Update balance
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ balance: newBalance })
    .eq("id", userId);

  if (updateError) {
    return { error: updateError.message };
  }

  // 3. Create payment record
  await (supabase as any).from("payments").insert({
    user_id: userId,
    amount: amount,
    status: "success",
  } as any);

  revalidatePath("/admin/users");
  return { success: true };
}

export async function toggleUserRole(userId: string, currentRole: string) {
  const supabase = (await createClient()) as any;
  const newRole = currentRole === "admin" ? "user" : "admin";

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole } as any)
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

// --- SUBSCRIPTION ACTIONS ---

export async function updateSubscription(userId: string, tariffId: string) {
  const supabase = (await createClient()) as any;

  // 1. Check if user already has an active subscription
  const { data: existingSub } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (existingSub) {
    // Update existing
    const { error } = await supabase
      .from("subscriptions")
      .update({ 
        tariff_id: tariffId,
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      } as any)
      .eq("id", existingSub.id);
    
    if (error) return { error: error.message };
  } else {
    // Create new
    const { error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: userId,
        tariff_id: tariffId,
        status: "active",
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      } as any);
    
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function cancelSubscription(subscriptionId: string) {
  const supabase = (await createClient()) as any;

  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "cancelled" } as any)
    .eq("id", subscriptionId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

// --- TARIFF ACTIONS ---

interface TariffFormData {
  name_ru: string;
  price: number;
  speed_mbps: number;
  description_ru: string;
  category: string;
}

export async function saveTariff(formData: TariffFormData, tariffId?: string) {
  const supabase = (await createClient()) as any;
  
  const payload: any = {
    name_ru: formData.name_ru,
    price: Number(formData.price),
    speed_mbps: Number(formData.speed_mbps),
    description_ru: formData.description_ru,
    category: formData.category,
  };

  let error;
  if (tariffId) {
    const { error: updateError } = await supabase
      .from("tariffs")
      .update(payload as any)
      .eq("id", tariffId);
    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from("tariffs")
      .insert(payload as any);
    error = insertError;
  }

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/tariffs");
  return { success: true };
}

export async function deleteTariff(tariffId: string) {
  const supabase = (await createClient()) as any;

  const { error } = await supabase
    .from("tariffs")
    .delete()
    .eq("id", tariffId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/tariffs");
  return { success: true };
}

// --- TICKET ACTIONS ---

export async function closeTicket(ticketId: string) {
  const supabase = (await createClient()) as any;

  const { error } = await supabase
    .from("tickets")
    .update({ status: "closed" } as any)
    .eq("id", ticketId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/tickets");
  return { success: true };
}
