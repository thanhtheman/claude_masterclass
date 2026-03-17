import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider } from '@/contexts/AuthContext'
import { useUser } from '@/hooks/useUser'

vi.mock('@/lib/firebase', () => ({ auth: {} }))

const mockOnAuthStateChanged = vi.fn()
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),
}))

function TestConsumer() {
  const { user, loading } = useUser()
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? (user as { uid: string }).uid : 'null'}</span>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('starts with loading: true and user: null before auth state resolves', () => {
    mockOnAuthStateChanged.mockImplementation(() => () => {})

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading').textContent).toBe('true')
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  it('sets user and loading: false after auth state resolves with a signed-in user', () => {
    mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: unknown) => void) => {
      callback({ uid: 'user-123' })
      return () => {}
    })

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading').textContent).toBe('false')
    expect(screen.getByTestId('user').textContent).toBe('user-123')
  })

  it('sets user: null and loading: false after auth state resolves with no user', () => {
    mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: null) => void) => {
      callback(null)
      return () => {}
    })

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading').textContent).toBe('false')
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  it('calls the unsubscribe function on unmount', () => {
    const unsubscribe = vi.fn()
    mockOnAuthStateChanged.mockImplementation(() => unsubscribe)

    const { unmount } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    unmount()
    expect(unsubscribe).toHaveBeenCalledOnce()
  })
})
