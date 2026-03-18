"use client"

import { signInWithEmailAndPassword } from "firebase/auth"
import AuthForm from "@/components/AuthForm"
import { auth } from "@/lib/firebase"

const errorMessages: Record<string, string> = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/too-many-requests": "Too many failed attempts. Please try again later.",
}

export default function LoginPage() {
  async function handleLogin(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      const code = (err as { code?: string }).code ?? ""
      throw new Error(errorMessages[code] ?? "Something went wrong. Please try again.")
    }
  }

  return <AuthForm mode="login" onSubmit={handleLogin} successMessage="You are now logged in." />
}
