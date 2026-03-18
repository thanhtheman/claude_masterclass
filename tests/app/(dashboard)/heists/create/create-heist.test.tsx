import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/firebase', () => ({ db: {} }))

vi.mock('@/hooks/useUser', () => ({
  useUser: () => ({ user: { uid: 'user-1', displayName: 'SwiftFoxAgent' } }),
}))

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))

const mockAddDoc = vi.fn()
const mockGetDocs = vi.fn()
const mockCollection = vi.fn(() => 'collection-ref')
const mockServerTimestamp = vi.fn(() => 'SERVER_TIMESTAMP')
const mockWithConverter = vi.fn(function () { return this })

vi.mock('firebase/firestore', () => ({
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  collection: (...args: unknown[]) => ({
    withConverter: mockWithConverter,
  }),
  serverTimestamp: () => mockServerTimestamp(),
}))

const mockUsers = [
  { id: 'user-2', codename: 'SilentRavenSpy' },
  { id: 'user-3', codename: 'BoldGhostRunner' },
]

function makeMockSnapshot(users: typeof mockUsers) {
  return {
    docs: users.map((u) => ({
      data: () => u,
      id: u.id,
    })),
  }
}

async function renderPage() {
  const { default: CreateHeistPage } = await import(
    '@/app/(dashboard)/heists/create/page'
  )
  render(<CreateHeistPage />)
}

describe('CreateHeistPage', () => {
  beforeEach(() => {
    vi.resetModules()
    mockPush.mockReset()
    mockAddDoc.mockResolvedValue({ id: 'new-heist-id' })
    mockGetDocs.mockResolvedValue(makeMockSnapshot(mockUsers))
  })

  it('renders title, description, and assignee fields', async () => {
    await renderPage()
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Assign to')).toBeInTheDocument()
  })

  it('populates assignee dropdown from Firestore, excluding the current user', async () => {
    await renderPage()
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'SilentRavenSpy' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'BoldGhostRunner' })).toBeInTheDocument()
    })
    // current user (uid: 'user-1') should not appear
    expect(screen.queryByRole('option', { name: 'SwiftFoxAgent' })).not.toBeInTheDocument()
  })

  it('calls addDoc with the correct CreateHeistInput shape on submit', async () => {
    await renderPage()
    await waitFor(() => screen.getByRole('option', { name: 'SilentRavenSpy' }))

    await userEvent.type(screen.getByLabelText('Title'), 'Stapler Snatch')
    await userEvent.type(screen.getByLabelText('Description'), 'Hide the boss\'s stapler')
    await userEvent.selectOptions(screen.getByLabelText('Assign to'), 'user-2')
    await userEvent.click(screen.getByRole('button', { name: 'Launch Heist' }))

    await waitFor(() => expect(mockAddDoc).toHaveBeenCalledOnce())

    const input = mockAddDoc.mock.calls[0][1]
    expect(input.title).toBe('Stapler Snatch')
    expect(input.description).toBe('Hide the boss\'s stapler')
    expect(input.createdBy).toBe('user-1')
    expect(input.createdByCodename).toBe('SwiftFoxAgent')
    expect(input.assignedTo).toBe('user-2')
    expect(input.assignedToCodename).toBe('SilentRavenSpy')
    expect(input.finalStatus).toBeNull()
    expect(input.createdAt).toBeDefined()
    expect(input.deadline).toBeInstanceOf(Date)
  })

  it('redirects to /heists after successful submission', async () => {
    await renderPage()
    await waitFor(() => screen.getByRole('option', { name: 'SilentRavenSpy' }))

    await userEvent.type(screen.getByLabelText('Title'), 'Stapler Snatch')
    await userEvent.type(screen.getByLabelText('Description'), 'Hide the boss\'s stapler')
    await userEvent.click(screen.getByRole('button', { name: 'Launch Heist' }))

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/heists'))
  })

  it('displays an error message when addDoc rejects', async () => {
    mockAddDoc.mockRejectedValue(new Error('Firestore error'))
    await renderPage()
    await waitFor(() => screen.getByRole('option', { name: 'SilentRavenSpy' }))

    await userEvent.type(screen.getByLabelText('Title'), 'Stapler Snatch')
    await userEvent.type(screen.getByLabelText('Description'), 'Hide the boss\'s stapler')
    await userEvent.click(screen.getByRole('button', { name: 'Launch Heist' }))

    await waitFor(() =>
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument()
    )
  })

  it('disables the submit button while submitting', async () => {
    let resolve!: () => void
    mockAddDoc.mockReturnValue(new Promise<void>((r) => { resolve = r }))

    await renderPage()
    await waitFor(() => screen.getByRole('option', { name: 'SilentRavenSpy' }))

    await userEvent.type(screen.getByLabelText('Title'), 'Stapler Snatch')
    await userEvent.type(screen.getByLabelText('Description'), 'Hide the boss\'s stapler')
    await userEvent.click(screen.getByRole('button', { name: 'Launch Heist' }))

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Dispatching…' })).toBeDisabled()
    )

    resolve()
  })
})
