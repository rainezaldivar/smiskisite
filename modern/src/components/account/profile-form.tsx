"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Camera, Check, LoaderCircle } from "lucide-react";
import type { Profile } from "@/lib/auth";
import { updateProfile, uploadAvatar } from "@/app/actions/profile";
import { initialFormState } from "./form-state";

const inputClass =
  "mt-2 w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-glow";

export function ProfileDetailsForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(
    updateProfile,
    initialFormState,
  );
  const fields = [
    {
      name: "name",
      label: "Full name",
      type: "text",
      value: profile.name,
      autoComplete: "name",
      maxLength: 80,
      required: true,
    },
    {
      name: "phone",
      label: "Phone number",
      type: "tel",
      value: profile.phone,
      autoComplete: "tel",
      maxLength: 30,
    },
    {
      name: "dob",
      label: "Date of birth",
      type: "date",
      value: profile.dob,
      autoComplete: "bday",
      max: new Date().toISOString().slice(0, 10),
      min: "1900-01-01",
    },
  ];
  const addressFields = [
    {
      name: "address",
      label: "Street and barangay",
      value: profile.address,
      autoComplete: "street-address",
      maxLength: 250,
    },
    {
      name: "city",
      label: "City / municipality",
      value: profile.city,
      autoComplete: "address-level2",
      maxLength: 100,
    },
    {
      name: "province",
      label: "Province",
      value: profile.province,
      autoComplete: "address-level1",
      maxLength: 100,
    },
  ];
  const error = (name: string) =>
    state.errors?.[name]?.length ? (
      <p id={`${name}-error`} className="mt-1.5 text-xs text-danger">
        {state.errors[name]?.[0]}
      </p>
    ) : null;

  return (
    <form action={action} className="space-y-8">
      {state.message && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`rounded-sm px-4 py-3 text-sm ${state.status === "success" ? "bg-soft text-accent" : "bg-danger-soft text-danger"}`}
        >
          {state.message}
        </p>
      )}
      <section>
        <h2 className="text-xl font-semibold text-ink">The basics</h2>
        <p className="mt-1 text-sm text-muted">
          A few details to make this space yours.
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="text-sm font-medium text-ink"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                min={field.min}
                max={field.max}
                maxLength={field.maxLength}
                required={field.required}
                defaultValue={field.value || ""}
                className={inputClass}
                aria-invalid={Boolean(state.errors?.[field.name]?.length)}
                aria-describedby={
                  state.errors?.[field.name]?.length
                    ? `${field.name}-error`
                    : undefined
                }
              />
              {error(field.name)}
            </div>
          ))}
          <div>
            <label
              htmlFor="gender"
              className="text-sm font-medium text-ink"
            >
              Gender{" "}
              <span className="font-normal text-muted">(optional)</span>
            </label>
            <select
              id="gender"
              name="gender"
              defaultValue={profile.gender || ""}
              className={inputClass}
              aria-invalid={Boolean(state.errors?.gender?.length)}
              aria-describedby={
                state.errors?.gender?.length ? "gender-error" : undefined
              }
            >
              <option value="">Choose an option</option>
              <option>Female</option>
              <option>Male</option>
              <option>Non-binary</option>
              <option>Prefer not to say</option>
            </select>
            {error("gender")}
          </div>
        </div>
      </section>
      <section className="border-t border-line pt-7">
        <h2 className="text-xl font-semibold text-ink">
          Delivery details
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          Used for the project’s simulated checkout. No purchases or payments
          are processed.
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {addressFields.map((field) => (
            <div
              key={field.name}
              className={field.name === "address" ? "sm:col-span-2" : ""}
            >
              <label
                htmlFor={field.name}
                className="text-sm font-medium text-ink"
              >
                {field.label}
              </label>
              <input
                name={field.name}
                id={field.name}
                type="text"
                autoComplete={field.autoComplete}
                maxLength={field.maxLength}
                defaultValue={field.value || ""}
                className={inputClass}
                aria-invalid={Boolean(state.errors?.[field.name]?.length)}
                aria-describedby={
                  state.errors?.[field.name]?.length
                    ? `${field.name}-error`
                    : undefined
                }
              />
              {error(field.name)}
            </div>
          ))}
        </div>
      </section>
      <button
        disabled={pending}
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-action px-7 py-3.5 text-sm font-semibold text-white hover:bg-action-hover disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {pending ? (
          <LoaderCircle size={16} className="animate-spin" aria-hidden />
        ) : (
          <Check size={16} aria-hidden />
        )}
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

function pictureSource(value: string | null) {
  if (!value) return null;
  if (/^https?:\/\//.test(value) || value.startsWith("/uploads/")) return value;
  return `/uploads/${encodeURIComponent(value)}`;
}

export function AvatarForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(
    uploadAvatar,
    initialFormState,
  );
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const source = pictureSource(profile.profile_picture);
  return (
    <div>
      <div className="mx-auto mb-5 flex size-28 items-center justify-center overflow-hidden rounded-sm bg-soft text-3xl font-semibold text-accent">
        {!source || failedSource === source ? (
          profile.name.slice(0, 2).toUpperCase()
        ) : (
          <Image
            draggable={false}
            key={profile.profile_picture}
            src={source}
            alt={`${profile.name}'s profile photo`}
            width={112}
            height={112}
            unoptimized
            className="size-full object-cover"
            onError={() => setFailedSource(source)}
          />
        )}
      </div>
      <h2 className="break-words text-xl font-semibold text-ink">
        {profile.name}
      </h2>
      <p className="mt-1 break-all text-sm text-muted">{profile.email}</p>
      <span className="mt-3 inline-block rounded-sm bg-soft px-3 py-1 text-xs font-medium capitalize text-accent">
        {profile.role === "admin" ? "Administrator" : "Customer"}
      </span>
      <form
        action={action}
        className="mt-7 border-t border-line pt-6 text-left"
      >
        <label
          htmlFor="avatar"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink"
        >
          <Camera size={16} aria-hidden /> Profile photo
        </label>
        <input
          id="avatar"
          name="avatar"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="mt-3 block w-full text-xs text-muted file:mr-2 file:rounded-sm file:border-0 file:bg-soft file:px-3 file:py-2 file:text-xs file:font-medium file:text-ink"
        />
        <p className="mt-2 text-xs text-muted">
          JPG, PNG, or WebP. Up to 5 MB.
        </p>
        <button
          disabled={pending}
          type="submit"
          className="mt-4 w-full rounded-sm border border-line px-4 py-2.5 text-xs font-semibold text-ink hover:bg-soft disabled:opacity-60"
        >
          {pending ? "Uploading…" : "Update photo"}
        </button>
        {state.message && (
          <p
            role={state.status === "error" ? "alert" : "status"}
            className={`mt-3 text-xs leading-5 ${state.status === "error" ? "text-danger" : "text-accent"}`}
          >
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
