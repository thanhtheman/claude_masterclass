import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/firebase', () => ({ auth: {} }))

const mockSignIn = vi.fn()
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignIn(...args),
}))

async function renderAndSubmit(email = 'test@example.com', password = 'password123') {
  const { default: LoginPage } = await import('@/app/(public)/login/page')
  render(<LoginPage />)
  await userEvent.type(screen.getByLabelText('Email'), email)
  await userEvent.type(screen.getByLabelText('Password'), password)
  await userEvent.click(screen.getByRole('button', { name: 'Log In' }))
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockSignIn.mockResolvedValue({ user: { uid: 'user-123' } })
  })

  it('calls signInWithEmailAndPassword with email and password', async () => {
    await renderAndSubmit()
    await waitFor(() =>
      expect(mockSignIn).toHaveBeenCalledWith({}, 'test@example.com', 'password123')
    )
  })

  it('shows success message after successful login', async () => {
    await renderAndSubmit()
    await waitFor(() =>
      expect(screen.getByText('You are now logged in.')).toBeInTheDocument()
    )
  })

  it('shows a friendly error for invalid credentials', async () => {
    mockSignIn.mockRejectedValue({ code: 'auth/invalid-credential' })
    await renderAndSubmit()
    await waitFor(() =>
      expect(screen.getByText('Incorrect email or password.')).toBeInTheDocument()
    )
  })

  it('shows a friendly error for too many attempts', async () => {
    mockSignIn.mockRejectedValue({ code: 'auth/too-many-requests' })
    await renderAndSubmit()
    await waitFor(() =>
      expect(screen.getByText('Too many failed attempts. Please try again later.')).toBeInTheDocument()
    )
  })
})
