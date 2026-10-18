import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getPublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

const otpTypes = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
] as const;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const rawType = searchParams.get("type");

  const env = getPublicEnv();

  let response = NextResponse.redirect(new URL("/dashboard", request.url));

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      auth: { flowType: "pkce" },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.redirect(new URL("/dashboard", request.url));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value),
          );
        },
      },
    },
  );

  let inviteToken: string | null = null;
  let failed = false;

  if (code) {
    // Fluxo PKCE: o GoTrue redireciona com ?code= apos confirmar o e-mail.
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      failed = true;
    } else {
      const value = data.user?.user_metadata?.invite_token;
      inviteToken = typeof value === "string" && value.length > 0 ? value : null;
    }
  } else if (
    tokenHash &&
    rawType &&
    (otpTypes as readonly string[]).includes(rawType)
  ) {
    // Fluxo alternativo: link com token_hash + type.
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: rawType as (typeof otpTypes)[number],
    });
    if (error) {
      failed = true;
    } else {
      const value = data.user?.user_metadata?.invite_token;
      inviteToken = typeof value === "string" && value.length > 0 ? value : null;
    }
  }

  if (failed) {
    return NextResponse.redirect(new URL("/login?error=confirm", request.url));
  }

  if (inviteToken) {
    response.headers.set(
      "Location",
      new URL(`/invite/${inviteToken}`, request.url).toString(),
    );
  }

  return response;
}
