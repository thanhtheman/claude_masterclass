import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))

const mockUseUser = vi.fn()
vi.mock('@/hooks/useUser', () => ({ useUser: () => mockUseUser() }))

async function renderLayout() {
  const { default: PublicLayout } = await import('@/app/(public)/layout')
  render(<PublicLayout><p>child content</p></PublicLayout>)
}

describe('PublicLayout', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockPush.mockReset()
  })

  it('shows loader while auth state is loading', async () => {
    mockUseUser.mockReturnValue({ user: null, loading: true })
    await renderLayout()
    expect(screen.getByText('Loading…')).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('redirects to /heists when user is authenticated', async () => {
    mockUseUser.mockReturnValue({ user: { uid: 'user-1' }, loading: false })
    await renderLayout()
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/heists'))
  })

  it('renders children when user is not authenticated', async () => {
    mockUseUser.mockReturnValue({ user: null, loading: false })
    await renderLayout()
    expect(screen.getByText('child content')).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })
})
