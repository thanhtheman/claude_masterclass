import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import Navbar from "@/components/Navbar"

vi.mock("@/lib/firebase", () => ({ auth: {} }))

const mockSignOut = vi.fn()
vi.mock("firebase/auth", () => ({ signOut: (...args: unknown[]) => mockSignOut(...args) }))

const mockUseUser = vi.fn()
vi.mock("@/hooks/useUser", () => ({ useUser: () => mockUseUser() }))

describe("Navbar", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockUseUser.mockReturnValue({ user: null, loading: false })
  })

  it("renders the main heading", () => {
    render(<Navbar />)
    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it("renders the Create Heist link", () => {
    render(<Navbar />)
    const createLink = screen.getByRole("link", { name: /create heist/i })
    expect(createLink).toBeInTheDocument()
    expect(createLink).toHaveAttribute("href", "/heists/create")
  })

  it("does not render the logout button when user is null", () => {
    mockUseUser.mockReturnValue({ user: null, loading: false })
    render(<Navbar />)
    expect(screen.queryByRole("button", { name: /logout/i })).not.toBeInTheDocument()
  })

  it("does not render the logout button while loading", () => {
    mockUseUser.mockReturnValue({ user: { uid: "user-1" }, loading: true })
    render(<Navbar />)
    expect(screen.queryByRole("button", { name: /logout/i })).not.toBeInTheDocument()
  })

  it("renders the logout button when user is signed in", () => {
    mockUseUser.mockReturnValue({ user: { uid: "user-1" }, loading: false })
    render(<Navbar />)
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument()
  })

  it("calls signOut when the logout button is clicked", async () => {
    mockUseUser.mockReturnValue({ user: { uid: "user-1" }, loading: false })
    mockSignOut.mockResolvedValue(undefined)
    render(<Navbar />)
    await userEvent.click(screen.getByRole("button", { name: /logout/i }))
    expect(mockSignOut).toHaveBeenCalledWith({})
  })
})
