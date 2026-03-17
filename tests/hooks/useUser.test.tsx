import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AuthProvider } from '@/contexts/AuthContext'
import { useUser } from '@/hooks/useUser'

vi.mock('@/lib/firebase', () => ({ auth: {} }))

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (_auth: unknown, callback: (user: unknown) => void) => {
    callback({ uid: 'user-abc' })
    return () => {}
  },
}))

describe('useUser', () => {
  it('throws when called outside AuthProvider', () => {
    expect(() => renderHook(() => useUser())).toThrow(
      'useUser must be used within an AuthProvider'
    )
  })

  it('returns user and loading when inside AuthProvider', () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: AuthProvider,
    })

    expect(result.current.loading).toBe(false)
    expect((result.current.user as { uid: string } | null)?.uid).toBe('user-abc')
  })
})
