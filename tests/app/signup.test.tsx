import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/firebase', () => ({ auth: {}, db: {} }))
vi.mock('@/lib/codename', () => ({ generateCodename: () => 'SwiftFoxAgent' }))

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))

const mockCreateUser = vi.fn()
const mockUpdateProfile = vi.fn()
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: (...args: unknown[]) => mockCreateUser(...args),
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
}))

const mockSetDoc = vi.fn()
const mockDoc = vi.fn(() => 'doc-ref')
vi.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => mockDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
}))

async function renderAndSubmit(email = 'test@example.com', password = 'password123') {
  const { default: SignupPage } = await import('@/app/(public)/signup/page')
  render(<SignupPage />)
  await userEvent.type(screen.getByLabelText('Email'), email)
  await userEvent.type(screen.getByLabelText('Password'), password)
  await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }))
}

describe('SignupPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockPush.mockReset()
    mockCreateUser.mockResolvedValue({ user: { uid: 'user-123' } })
    mockUpdateProfile.mockResolvedValue(undefined)
    mockSetDoc.mockResolvedValue(undefined)
  })

  it('calls createUserWithEmailAndPassword with email and password', async () => {
    await renderAndSubmit()
    await waitFor(() => expect(mockCreateUser).toHaveBeenCalledWith({}, 'test@example.com', 'password123'))
  })

  it('calls updateProfile with the generated codename', async () => {
    await renderAndSubmit()
    await waitFor(() =>
      expect(mockUpdateProfile).toHaveBeenCalledWith(
        { uid: 'user-123' },
        { displayName: 'SwiftFoxAgent' }
      )
    )
  })

  it('writes a Firestore document with id and codename but no email', async () => {
    await renderAndSubmit()
    await waitFor(() =>
      expect(mockSetDoc).toHaveBeenCalledWith(
        'doc-ref',
        { id: 'user-123', codename: 'SwiftFoxAgent' }
      )
    )
    const writtenData = mockSetDoc.mock.calls[0][1]
    expect(writtenData).not.toHaveProperty('email')
  })

  it('redirects to /heists on success', async () => {
    await renderAndSubmit()
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/heists'))
  })

  it('shows a friendly error when email is already in use', async () => {
    mockCreateUser.mockRejectedValue({ code: 'auth/email-already-in-use' })
    await renderAndSubmit()
    await waitFor(() =>
      expect(screen.getByText('An account with this email already exists.')).toBeInTheDocument()
    )
  })

  it('shows a friendly error when password is too weak', async () => {
    mockCreateUser.mockRejectedValue({ code: 'auth/weak-password' })
    await renderAndSubmit()
    await waitFor(() =>
      expect(screen.getByText('Password must be at least 6 characters.')).toBeInTheDocument()
    )
  })
})
