"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="text-lg font-semibold tracking-tight text-neutral-900">AgriForecast</Link>
        <p className="text-sm text-neutral-500 mt-1 mb-8">Log in to access your dashboard.</p>

        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="primary-button w-full justify-center"
          >
            Continue with Google
          </button>
          <p className="text-xs text-neutral-400 mt-4">
            By continuing, you agree to our terms of service.
          </p>
        </div>
      </div>
    </div>
  );
}
