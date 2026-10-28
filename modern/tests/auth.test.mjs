import test from "node:test";
import assert from "node:assert/strict";
import { safeNextPath } from "../src/lib/supabase/redirect.ts";
import {
  getSupabaseConfig,
  isSupabaseConfigured,
} from "../src/lib/supabase/config.ts";
import { newPasswordSchema } from "../src/lib/supabase/validation.ts";

test("auth redirects preserve local destinations", () => {
  assert.equal(
    safeNextPath("/catalog?series=yoga#figures"),
    "/catalog?series=yoga#figures",
  );
  assert.equal(safeNextPath("/checkout"), "/checkout");
  assert.equal(safeNextPath("/reset-password"), "/reset-password");
  assert.equal(safeNextPath("/"), "/");
});

test("new passwords enforce bcrypt's UTF-8 byte boundary", () => {
  assert.equal(newPasswordSchema.safeParse("short").success, false);
  assert.equal(
    newPasswordSchema.safeParse("long-enough-password").success,
    true,
  );
  assert.equal(newPasswordSchema.safeParse("a".repeat(72)).success, true);
  assert.equal(newPasswordSchema.safeParse("a".repeat(73)).success, false);
  assert.equal(newPasswordSchema.safeParse("🌱".repeat(18)).success, true);
  assert.equal(newPasswordSchema.safeParse("🌱".repeat(19)).success, false);
});

test("auth redirects reject external origins, protocol-relative paths and parser escapes", () => {
  for (const destination of [
    "https://evil.example/account",
    "//evil.example/account",
    "///evil.example",
    "/\\evil.example",
    "/\n/evil.example",
    "/\t/evil.example",
    "javascript:alert(1)",
    "data:text/html,hello",
    "",
    null,
    undefined,
  ]) {
    assert.equal(
      safeNextPath(destination),
      "/profile",
      `unsafe destination: ${JSON.stringify(destination)}`,
    );
  }
});

test("auth redirects avoid sign-in loops and callback destinations", () => {
  for (const destination of [
    "/login",
    "/login?next=/login",
    "/register/",
    "/logout",
    "/auth/callback?code=anything",
    "/auth/confirm",
    "/%6cogin",
    "/%2f/evil.example",
    "/%5cevil.example",
  ]) {
    assert.equal(safeNextPath(destination), "/profile");
  }
});

test("account configuration requires a complete valid public Supabase connection", () => {
  const keys = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ];
  const original = Object.fromEntries(
    keys.map((key) => [key, process.env[key]]),
  );
  try {
    keys.forEach((key) => delete process.env[key]);
    assert.equal(isSupabaseConfigured(), false);
    assert.throws(getSupabaseConfig, /not configured/);
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://project.supabase.co";
    assert.equal(isSupabaseConfigured(), false);
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY =
      "sb_publishable_test_only_not_a_real_key";
    assert.equal(isSupabaseConfigured(), true);
    assert.equal(getSupabaseConfig().url, "https://project.supabase.co");
    for (const invalidUrl of [
      "not a URL",
      "javascript:alert(1)",
      "https://user:password@project.supabase.co",
      "https://project.supabase.co/unexpected-path",
    ]) {
      process.env.NEXT_PUBLIC_SUPABASE_URL = invalidUrl;
      assert.equal(isSupabaseConfigured(), false);
    }
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321";
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
      "test_anon_key_for_local_config_only";
    assert.equal(isSupabaseConfigured(), true);
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "invalid short key";
    assert.equal(isSupabaseConfigured(), false);
  } finally {
    keys.forEach((key) => {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    });
  }
});
