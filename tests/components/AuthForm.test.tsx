import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import AuthForm from "@/components/AuthForm"

describe("AuthForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("renders email, password, and Log In button in login mode", () => {
    render(<AuthForm mode="login" />)
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument()
  })

  it("renders email, password, and Sign Up button in signup mode", () => {
    render(<AuthForm mode="signup" />)
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument()
  })

  it("defaults password field to type password", () => {
    render(<AuthForm mode="login" />)
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password")
  })

  it("toggles password visibility on icon click", async () => {
    const user = userEvent.setup()
    render(<AuthForm mode="login" />)

    const toggle = screen.getByRole("button", { name: "Show password" })
    await user.click(toggle)
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text")

    const hideToggle = screen.getByRole("button", { name: "Hide password" })
    await user.click(hideToggle)
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password")
  })

  it("shows error when submitting with empty fields", async () => {
    const spy = vi.spyOn(console, "log")
    const user = userEvent.setup()
    render(<AuthForm mode="login" />)

    await user.click(screen.getByRole("button", { name: "Log In" }))
    expect(screen.getByText("Please fill in all fields")).toBeInTheDocument()
    expect(spy).not.toHaveBeenCalled()
  })

  it("logs email and password on valid login submit", async () => {
    const spy = vi.spyOn(console, "log")
    const user = userEvent.setup()
    render(<AuthForm mode="login" />)

    await user.type(screen.getByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "secret123")
    await user.click(screen.getByRole("button", { name: "Log In" }))

    expect(spy).toHaveBeenCalledWith({ email: "test@example.com", password: "secret123" })
  })

  it("logs email and password on valid signup submit", async () => {
    const spy = vi.spyOn(console, "log")
    const user = userEvent.setup()
    render(<AuthForm mode="signup" />)

    await user.type(screen.getByLabelText("Email"), "new@example.com")
    await user.type(screen.getByLabelText("Password"), "pass456")
    await user.click(screen.getByRole("button", { name: "Sign Up" }))

    expect(spy).toHaveBeenCalledWith({ email: "new@example.com", password: "pass456" })
  })

  it("login form has a link to /signup", () => {
    render(<AuthForm mode="login" />)
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute("href", "/signup")
  })

  it("signup form has a link to /login", () => {
    render(<AuthForm mode="signup" />)
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute("href", "/login")
  })
})
