"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/components/account/form-state";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Use at least 2 characters.").max(80),
  phone: z.string().trim().max(30, "Use no more than 30 characters."),
  gender: z.enum(["", "Female", "Male", "Non-binary", "Prefer not to say"]),
  dob: z.string().refine((value) => {
    if (!value) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return (
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value &&
      value <= new Date().toISOString().slice(0, 10) &&
      value >= "1900-01-01"
    );
  }, "Enter a valid date of birth."),
  address: z.string().trim().max(250),
  city: z.string().trim().max(100),
  province: z.string().trim().max(100),
});

export async function updateProfile(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const profile = await requireProfile();
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    gender: formData.get("gender"),
    dob: formData.get("dob"),
    address: formData.get("address"),
    city: formData.get("city"),
    province: formData.get("province"),
  });
  if (!parsed.success)
    return {
      status: "error",
      message: "Check the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  const details = parsed.data;
  try {
    const supabase = await createClient();
    const { error, data } = await supabase
      .from("profiles")
      .update({
        name: details.name,
        phone: details.phone || null,
        gender: details.gender || null,
        dob: details.dob || null,
        address: details.address || null,
        city: details.city || null,
        province: details.province || null,
      })
      .eq("id", profile.id)
      .select("id")
      .single();
    if (error || !data)
      return {
        status: "error",
        message: "Your changes could not be saved. Please try again.",
      };
  } catch {
    return {
      status: "error",
      message:
        "The account service could not be reached. Please try again shortly.",
    };
  }
  revalidatePath("/profile");
  revalidatePath("/checkout");
  revalidatePath("/", "layout");
  return { status: "success", message: "Your profile has been saved." };
}

export async function uploadAvatar(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const profile = await requireProfile();
  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0)
    return { status: "error", message: "Choose a JPG, PNG, or WebP image." };
  if (file.size > 5 * 1024 * 1024)
    return { status: "error", message: "Choose an image of 5 MB or less." };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
    (byte, index) => bytes[index] === byte,
  );
  const webp =
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  const image = jpeg
    ? { extension: "jpg", mime: "image/jpeg" }
    : png
      ? { extension: "png", mime: "image/png" }
      : webp
        ? { extension: "webp", mime: "image/webp" }
        : null;
  if (!image || (file.type && file.type !== image.mime))
    return {
      status: "error",
      message: "Choose a valid JPG, PNG, or WebP image.",
    };
  const objectPath = `${profile.id}/${crypto.randomUUID()}.${image.extension}`;
  try {
    const supabase = await createClient();
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(objectPath, bytes, { contentType: image.mime, upsert: false });
    if (uploadError)
      return {
        status: "error",
        message: "Your photo could not be uploaded. Please try again.",
      };
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(objectPath);
    const { data, error } = await supabase
      .from("profiles")
      .update({ profile_picture: publicUrl })
      .eq("id", profile.id)
      .select("id")
      .single();
    if (error || !data) {
      await supabase.storage.from("avatars").remove([objectPath]);
      return {
        status: "error",
        message: "Your photo could not be saved. Please try again.",
      };
    }
    const prefix = supabase.storage
      .from("avatars")
      .getPublicUrl(`${profile.id}/`).data.publicUrl;
    if (profile.profile_picture?.startsWith(prefix)) {
      const oldName = profile.profile_picture.slice(prefix.length);
      if (oldName && !oldName.includes("/") && !oldName.includes("?")) {
        try {
          await supabase.storage
            .from("avatars")
            .remove([`${profile.id}/${oldName}`]);
        } catch {
          // The new photo is already saved; old-file cleanup can be retried later.
        }
      }
    }
  } catch {
    return {
      status: "error",
      message:
        "The photo service could not be reached. Please try again shortly.",
    };
  }
  revalidatePath("/profile");
  revalidatePath("/", "layout");
  return { status: "success", message: "Your profile photo has been updated." };
}
