"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { requestPasswordReset, resetPassword } from "@/app/actions/auth";
import { initialFormState } from "./form-state";

const inputClass =
  "mt-2 w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-glow";

export function PasswordForm({ mode }: { mode: "request" | "reset" }) {
  const isReset = mode === "reset";
  const [state, action, pending] = useActionState(
    isReset ? resetPassword : requestPasswordReset,
    initialFormState,
  );
  const fields: {
    name: string;
    label: string;
    type: string;
    autoComplete: string;
    minLength?: number;
    maxLength: number;
  }[] = isReset
    ? [
        {
          name: "password",
          label: "New password",
          type: "password",
          autoComplete: "new-password",
          minLength: 8,
          maxLength: 72,
        },
        {
          name: "confirmPassword",
          label: "Confirm new password",
          type: "password",
          autoComplete: "new-password",
          minLength: 8,
          maxLength: 72,
        },
      ]
    : [
        {
          name: "email",
          label: "Email address",
          type: "email",
          autoComplete: "email",
          maxLength: 254,
        },
      ];
  return (
    <form action={action} className="space-y-5">
      {state.message && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`rounded-sm px-4 py-3 text-sm leading-6 ${state.status === "success" ? "bg-soft text-accent" : "bg-danger-soft text-danger"}`}
        >
          {state.message}
        </p>
      )}
      {state.status !== "success" && (
        <>
          {fields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={`recovery-${field.name}`}
                className="text-sm font-medium text-ink"
              >
                {field.label}
              </label>
              <input
                id={`recovery-${field.name}`}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                minLength={field.minLength}
                maxLength={field.maxLength}
                required
                className={inputClass}
                aria-invalid={Boolean(state.errors?.[field.name]?.length)}
                aria-describedby={
                  state.errors?.[field.name]?.length
                    ? `${field.name}-error`
                    : undefined
                }
              />
              {state.errors?.[field.name]?.length ? (
                <p
                  id={`${field.name}-error`}
                  className="mt-1.5 text-xs text-danger"
                >
                  {state.errors[field.name]?.[0]}
                </p>
              ) : null}
            </div>
          ))}
          {isReset && (
            <p className="text-xs leading-6 text-muted">
              Use at least 8 characters. Emoji and accented characters count
              toward the 72-byte password limit.
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-action px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-action-hover disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? (
              <LoaderCircle size={17} className="animate-spin" aria-hidden />
            ) : (
              <ArrowRight size={16} aria-hidden />
            )}
            {pending
              ? isReset
                ? "Updating password…"
                : "Requesting link…"
              : isReset
                ? "Save new password"
                : "Send reset link"}
          </button>
        </>
      )}
      <p className="text-center text-sm">
        <Link
          href={isReset && state.status === "success" ? "/profile" : "/login"}
          className="font-semibold text-ink underline decoration-accent underline-offset-4"
        >
          {isReset && state.status === "success"
            ? "Back to my account"
            : "Back to sign in"}
        </Link>
      </p>
      {isReset && state.status !== "success" && (
        <p className="text-center text-xs">
          <Link
            href="/forgot-password"
            className="text-muted underline underline-offset-4"
          >
            Request a fresh reset link
          </Link>
        </p>
      )}
    </form>
  );
}
