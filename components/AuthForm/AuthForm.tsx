"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import styles from "./AuthForm.module.css"

interface AuthFormProps {
  mode: "login" | "signup"
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const isLogin = mode === "login"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields")
      return
    }

    console.log({ email, password })
    setEmail("")
    setPassword("")
  }

  return (
    <div className="center-content">
      <div className="page-content">
        <h2 className="form-title">
          {isLogin ? "Log in to Your Account" : "Sign Up for an Account"}
        </h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              className={styles.input}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <div className={styles.passwordWrapper}>
              <input
                className={styles.input}
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn}>
            {isLogin ? "Log In" : "Sign Up"}
          </button>

          <p className={styles.switchLink}>
            {isLogin ? (
              <>Don&apos;t have an account? <Link href="/signup">Sign up</Link></>
            ) : (
              <>Already have an account? <Link href="/login">Log in</Link></>
            )}
          </p>
        </form>
      </div>
    </div>
  )
}
