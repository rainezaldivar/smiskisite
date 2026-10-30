"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { login, register } from "@/app/actions/auth";
import { initialFormState } from "./form-state";

const inputClass =
  "mt-2 w-full rounded-sm border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-glow";

export function AuthForm({
  mode,
  next = "/profile",
}: {
  mode: "login" | "register";
  next?: string;
}) {
  const isRegister = mode === "register";
  const [state, action, pending] = useActionState(
    isRegister ? register : login,
    initialFormState,
  );
  const fields = [
    ...(isRegister
      ? [
          {
            name: "name",
            label: "Full name",
            type: "text",
            autocomplete: "name",
            minLength: 2,
            maxLength: 80,
          },
        ]
      : []),
    {
      name: "email",
      label: "Email address",
      type: "email",
      autocomplete: "email",
      maxLength: 254,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      autocomplete: isRegister ? "new-password" : "current-password",
      minLength: isRegister ? 8 : 1,
      maxLength: isRegister ? 72 : 256,
    },
    ...(isRegister
      ? [
          {
            name: "confirmPassword",
            label: "Confirm password",
            type: "password",
            autocomplete: "new-password",
            minLength: 8,
            maxLength: 72,
          },
        ]
      : []),
  ];

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      {state.message && (
        <div
          role={state.status === "error" ? "alert" : "status"}
          className={`rounded-sm px-4 py-3 text-sm leading-relaxed ${state.status === "success" ? "bg-soft text-accent" : "bg-danger-soft text-danger"}`}
        >
          {state.message}
        </div>
      )}
      {!(isRegister && state.status === "success") && (
        <>
          {fields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={`auth-${field.name}`}
                className="text-sm font-medium text-ink"
              >
                {field.label}
              </label>
              <input
                id={`auth-${field.name}`}
                name={field.name}
                type={field.type}
                autoComplete={field.autocomplete}
                required
                minLength={field.minLength}
                maxLength={field.maxLength}
                className={inputClass}
                aria-invalid={Boolean(state.errors?.[field.name]?.length)}
                aria-describedby={
                  state.errors?.[field.name]?.length
                    ? `${field.name}-error`
                    : undefined
                }
              />
              {state.errors?.[field.name]?.map((error) => (
                <p
                  id={`${field.name}-error`}
                  key={error}
                  className="mt-1.5 text-xs text-danger"
                >
                  {error}
                </p>
              ))}
            </div>
          ))}
          {isRegister && (
            <p className="text-xs leading-relaxed text-muted">
              Use at least 8 characters. We’ll send a confirmation link to your
              email.
            </p>
          )}
          {!isRegister && (
            <p className="text-right text-xs">
              <Link
                href="/forgot-password"
                className="font-medium text-accent underline underline-offset-4"
              >
                Forgot your password?
              </Link>
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-action px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-action-hover disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? (
              <LoaderCircle size={17} className="animate-spin" aria-hidden />
            ) : null}
            {pending
              ? isRegister
                ? "Creating account…"
                : "Signing in…"
              : isRegister
                ? "Create account"
                : "Sign in"}
            {!pending && <ArrowRight size={16} aria-hidden />}
          </button>
        </>
      )}
      <p className="pt-1 text-center text-sm text-muted">
        {isRegister ? "Already part of the family?" : "New around here?"}{" "}
        <Link
          className="font-semibold text-ink underline decoration-accent underline-offset-4"
          href={isRegister ? "/login" : "/register"}
        >
          {isRegister ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
