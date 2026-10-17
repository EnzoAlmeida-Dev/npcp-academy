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

  if (tokenHash && rawType && (otpTypes as readonly string[]).includes(rawType)) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: rawType as (typeof otpTypes)[number],
    });

    if (error) {
      return NextResponse.redirect(new URL("/login?error=confirm", request.url));
    }

    const inviteToken = data.user?.user_metadata?.invite_token;
    if (typeof inviteToken === "string" && inviteToken.length > 0) {
      response.headers.set(
        "Location",
        new URL(`/invite/${inviteToken}`, request.url).toString(),
      );
    }
  }

  return response;
}
