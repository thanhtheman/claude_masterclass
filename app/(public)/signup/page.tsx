"use client"

import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import AuthForm from "@/components/AuthForm"
import { auth, db } from "@/lib/firebase"
import { generateCodename } from "@/lib/codename"

const errorMessages: Record<string, string> = {
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password must be at least 6 characters.",
}

export default function SignupPage() {
  const router = useRouter()

  async function handleSignup(email: string, password: string) {
    try {
      const codename = generateCodename()
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, { displayName: codename })
      await setDoc(doc(db, "users", user.uid), { id: user.uid, codename })
      router.push("/heists")
    } catch (err) {
      const code = (err as { code?: string }).code ?? ""
      throw new Error(errorMessages[code] ?? "Something went wrong. Please try again.")
    }
  }

  return <AuthForm mode="signup" onSubmit={handleSignup} />
}
