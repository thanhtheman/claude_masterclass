import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useHeists } from '@/hooks/useHeists'

vi.mock('@/lib/firebase', () => ({ db: {} }))

const mockUseUser = vi.fn()
vi.mock('@/hooks/useUser', () => ({ useUser: () => mockUseUser() }))

const mockUnsubscribe = vi.fn()
const mockOnSnapshot = vi.fn()
const mockWhere = vi.fn()
const mockQuery = vi.fn(() => 'mock-query')

vi.mock('firebase/firestore', () => ({
  collection: () => ({ withConverter: () => 'collection-ref' }),
  query: (...args: unknown[]) => mockQuery(...args),
  where: (...args: unknown[]) => mockWhere(...args),
  onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
}))

describe('useHeists', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mockUseUser.mockReturnValue({ user: { uid: 'user-1' }, loading: false })
    mockQuery.mockReturnValue('mock-query')
    mockOnSnapshot.mockImplementation((_q: unknown, onNext: (snap: unknown) => void) => {
      onNext({ docs: [] })
      return mockUnsubscribe
    })
  })

  it('returns [] and does not subscribe when user is null', () => {
    mockUseUser.mockReturnValue({ user: null, loading: false })
    const { result } = renderHook(() => useHeists('active'))
    expect(result.current).toEqual([])
    expect(mockOnSnapshot).not.toHaveBeenCalled()
  })

  it('returns [] and does not subscribe while loading', () => {
    mockUseUser.mockReturnValue({ user: { uid: 'user-1' }, loading: true })
    const { result } = renderHook(() => useHeists('active'))
    expect(result.current).toEqual([])
    expect(mockOnSnapshot).not.toHaveBeenCalled()
  })

  it("uses correct where clauses for 'active' mode", () => {
    renderHook(() => useHeists('active'))
    expect(mockWhere).toHaveBeenCalledWith('assignedTo', '==', 'user-1')
    expect(mockWhere).toHaveBeenCalledWith('deadline', '>', expect.any(Date))
  })

  it("uses correct where clauses for 'assigned' mode", () => {
    renderHook(() => useHeists('assigned'))
    expect(mockWhere).toHaveBeenCalledWith('createdBy', '==', 'user-1')
    expect(mockWhere).toHaveBeenCalledWith('deadline', '>', expect.any(Date))
  })

  it("uses correct where clauses for 'expired' mode", () => {
    renderHook(() => useHeists('expired'))
    expect(mockWhere).toHaveBeenCalledWith('deadline', '<=', expect.any(Date))
    expect(mockWhere).toHaveBeenCalledWith('finalStatus', '!=', null)
  })

  it('returns mapped heist objects when snapshot resolves', async () => {
    const mockHeistData = {
      id: 'h1',
      title: 'Stapler Snatch',
      description: 'Hide the stapler',
      createdBy: 'user-1',
      createdByCodename: 'SwiftFoxAgent',
      assignedTo: 'user-2',
      assignedToCodename: 'SilentRavenSpy',
      deadline: new Date(),
      finalStatus: null,
      createdAt: new Date(),
    }
    mockOnSnapshot.mockImplementation((_q: unknown, onNext: (snap: unknown) => void) => {
      onNext({ docs: [{ data: () => mockHeistData }] })
      return mockUnsubscribe
    })
    const { result } = renderHook(() => useHeists('active'))
    await waitFor(() => expect(result.current).toHaveLength(1))
    expect(result.current[0].title).toBe('Stapler Snatch')
  })

  it('calls the onSnapshot unsubscribe function on unmount', () => {
    const { unmount } = renderHook(() => useHeists('active'))
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalledOnce()
  })
})
