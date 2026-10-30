"use client";

import { useActionState, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { login, register } from "@/app/actions/auth";
import { initialFormState } from "./form-state";
import { getNewPasswordError } from "@/lib/supabase/password-rules.mjs";

const inputClass =
  "mt-1 block w-full rounded-sm border px-3 py-2.5 text-sm text-ink outline-none transition focus:ring-2 sm:py-1 lg:py-2.5";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
  const [values, setValues] = useState<Record<string, string>>({});
  const [submittedValues, setSubmittedValues] = useState<
    Record<string, string>
  >({});
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  function getFieldError(
    name: string,
    currentValues: Record<string, string>,
    input?: HTMLInputElement,
  ): string | undefined {
    const value = currentValues[name] ?? "";
    if (name === "email") {
      const email = value.trim();
      if (!email) return "Enter your email address.";
      if (
        email.length > 254 ||
        !emailPattern.test(email) ||
        (input && !input.checkValidity())
      )
        return "Enter a valid email address.";
    }
    if (name === "firstName" || name === "surname") {
      if (!value.trim())
        return name === "firstName"
          ? "Enter your first name."
          : "Enter your surname.";
      if (value.trim().length > 80) return "Use no more than 80 characters.";
    }
    if (name === "password")
      return isRegister
        ? getNewPasswordError(value)
        : value
          ? undefined
          : "Enter your password.";
    if (name === "confirmPassword") {
      if (!value) return "Confirm your password.";
      if (value !== currentValues.password) return "Passwords do not match.";
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const currentValues = Object.fromEntries(
      fields.map(({ name }) => [name, String(formData.get(name) ?? "")]),
    ) as Record<string, string>;
    setValues(currentValues);
    setSubmittedValues(currentValues);
    const errors: Record<string, string> = {};
    for (const field of fields) {
      const element = event.currentTarget.elements.namedItem(field.name);
      const error = getFieldError(
        field.name,
        currentValues,
        element instanceof HTMLInputElement ? element : undefined,
      );
      if (error) errors[field.name] = error;
    }

    setLocalErrors(errors);
    if (Object.keys(errors).length) event.preventDefault();
  }

  function handleChange(name: string, input: HTMLInputElement) {
    const currentValues = { ...values, [name]: input.value };
    setValues(currentValues);
    setLocalErrors((previous) => {
      const updated = { ...previous };
      const error = getFieldError(name, currentValues, input);
      if (error) updated[name] = error;
      else delete updated[name];
      if (name === "password" && isRegister && currentValues.confirmPassword) {
        const confirmError = getFieldError("confirmPassword", currentValues);
        if (confirmError) updated.confirmPassword = confirmError;
        else delete updated.confirmPassword;
      }
      return updated;
    });
  }
  const fields = [
    ...(isRegister
      ? [
          {
            name: "firstName",
            label: "First name",
            type: "text",
            autocomplete: "given-name",
            minLength: 1,
            maxLength: 80,
          },
          {
            name: "surname",
            label: "Surname",
            type: "text",
            autocomplete: "family-name",
            minLength: 1,
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

  function renderField(field: (typeof fields)[number]) {
    const error =
      localErrors[field.name] ??
      (values[field.name] === submittedValues[field.name]
        ? state.errors?.[field.name]?.[0]
        : undefined);
    return (
      <div key={field.name}>
        <label
          htmlFor={`auth-${field.name}`}
          className="block text-xs font-medium leading-none text-ink lg:text-sm lg:leading-normal"
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
          value={values[field.name] ?? ""}
          onChange={(event) => handleChange(field.name, event.currentTarget)}
          onBlur={(event) => handleChange(field.name, event.currentTarget)}
          className={`${inputClass} ${error ? "border-danger bg-danger-soft/25 ring-2 ring-danger/50 focus:border-danger focus:ring-danger" : "border-line bg-surface focus:border-accent focus:ring-glow"}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${field.name}-error` : undefined}
        />
        {error && (
          <p
            id={`${field.name}-error`}
            aria-live="polite"
            className="mt-1 truncate text-xs leading-4 text-danger"
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      action={action}
      onSubmit={handleSubmit}
      noValidate
      className="auth-form space-y-4 lg:space-y-5"
    >
      <input type="hidden" name="next" value={next} />
      {state.message && !Object.keys(state.errors ?? {}).length && (
        <div
          role={state.status === "error" ? "alert" : "status"}
          className={`rounded-sm px-4 py-3 text-sm leading-relaxed ${state.status === "success" ? "bg-soft text-accent" : "bg-danger-soft text-danger"}`}
        >
          {state.message}
        </div>
      )}
      {!(isRegister && state.status === "success") && (
        <>
          {isRegister && (
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-6">
              {fields.slice(0, 2).map(renderField)}
            </div>
          )}
          {fields.slice(isRegister ? 2 : 0).map(renderField)}
          {!isRegister && (
            <p className="auth-forgot-link text-right text-xs">
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
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-action px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-action-hover disabled:cursor-wait disabled:opacity-60 sm:py-1.5 lg:py-3.5"
          >
            {pending ? (
              <LoaderCircle size={17} className="animate-spin" aria-hidden />
            ) : null}
            {pending
              ? isRegister
                ? "Creating account…"
                : "Logging in…"
              : isRegister
                ? "Create account"
                : "Log in"}
            {!pending && <ArrowRight size={16} aria-hidden />}
          </button>
        </>
      )}
      <p className={`pt-1 text-center text-sm text-muted ${isRegister ? "" : "auth-login-switch"}`}>
        {isRegister ? "Already part of the family?" : "New around here?"}{" "}
        <Link
          className="font-semibold text-ink underline decoration-accent underline-offset-4"
          href={isRegister ? "/login" : "/register"}
        >
          {isRegister ? "Log in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
