"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { deleteCustomer } from "@/app/actions/admin";
import { initialFormState } from "./form-state";

export function DeleteCustomerForm({ id, name }: { id: string; name: string }) {
  const [state, action, pending] = useActionState(
    deleteCustomer,
    initialFormState,
  );
  return (
    <details className="max-w-64 text-left">
      <summary className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-danger px-3 py-2 text-xs font-medium text-danger hover:bg-danger-soft">
        <Trash2 size={13} aria-hidden /> Delete
        <span className="sr-only"> {name}’s account</span>
      </summary>
      <form
        action={action}
        className="mt-3 rounded-sm border border-danger bg-danger-soft/60 p-3"
      >
        <input type="hidden" name="userId" value={id} />
        <p className="text-xs leading-5 text-danger">
          Permanently delete {name}’s account? Accounts with orders are kept to
          preserve their history.
        </p>
        <label className="mt-3 flex items-start gap-2 text-xs leading-5 text-danger">
          <input
            type="checkbox"
            name="confirmation"
            value="delete"
            required
            className="mt-1 accent-red-700"
          />{" "}
          I understand this cannot be undone.
        </label>
        <button
          type="submit"
          disabled={pending}
          className="mt-3 rounded-sm bg-danger-action px-3 py-2 text-xs font-medium text-white hover:bg-danger-action-hover disabled:opacity-60"
        >
          {pending ? "Deleting…" : "Delete account"}
        </button>
        {state.message && (
          <p
            role={state.status === "error" ? "alert" : "status"}
            className="mt-2 text-xs leading-5 text-danger"
          >
            {state.message}
          </p>
        )}
      </form>
    </details>
  );
}
