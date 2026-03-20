import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { HeistCard, HeistCardSkeleton } from '@/components/HeistCard'
import type { Heist } from '@/types/firestore'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

const mockGetTimeRemaining = vi.fn()
vi.mock('@/lib/countdown', () => ({
  getTimeRemaining: (...args: unknown[]) => mockGetTimeRemaining(...args),
}))

const baseHeist: Heist = {
  id: 'heist-1',
  title: 'Steal the Stapler',
  description: 'Hide the stapler in the jello',
  createdBy: 'user-1',
  createdByCodename: 'SwiftFoxAgent',
  assignedTo: 'user-2',
  assignedToCodename: 'SilentRavenSpy',
  deadline: new Date(2026, 3, 1, 12, 0, 0), // Apr 1, 2026 noon local time
  finalStatus: null,
  createdAt: new Date(2026, 2, 20, 12, 0, 0),
}

describe('HeistCard', () => {
  beforeEach(() => {
    mockGetTimeRemaining.mockClear()
    mockGetTimeRemaining.mockReturnValue('2d 4h')
  })

  it('renders the heist title as a link to the details page', () => {
    render(<HeistCard heist={baseHeist} status="active" />)
    const link = screen.getByRole('link', { name: 'Steal the Stapler' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/heists/heist-1')
  })

  it('renders the assignedToCodename with @ prefix', () => {
    render(<HeistCard heist={baseHeist} status="active" />)
    expect(screen.getByText('@SilentRavenSpy')).toBeInTheDocument()
  })

  it('renders the createdByCodename with @ prefix', () => {
    render(<HeistCard heist={baseHeist} status="active" />)
    expect(screen.getByText('@SwiftFoxAgent')).toBeInTheDocument()
  })

  it('shows — fallback when assignedToCodename is empty', () => {
    const heist = { ...baseHeist, assignedToCodename: '' }
    render(<HeistCard heist={heist} status="active" />)
    expect(screen.getByText('@—')).toBeInTheDocument()
  })

  it('shows Active badge for active status', () => {
    render(<HeistCard heist={baseHeist} status="active" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('shows Assigned badge for assigned status', () => {
    render(<HeistCard heist={baseHeist} status="assigned" />)
    expect(screen.getByText('Assigned')).toBeInTheDocument()
  })

  it('renders the formatted deadline label', () => {
    render(<HeistCard heist={baseHeist} status="active" />)
    expect(screen.getByText(/Apr 1, 2026/)).toBeInTheDocument()
  })

  it('renders the time remaining from getTimeRemaining', () => {
    render(<HeistCard heist={baseHeist} status="active" />)
    expect(screen.getByText('2d 4h')).toBeInTheDocument()
  })

  it('renders Overdue when getTimeRemaining returns Overdue', () => {
    mockGetTimeRemaining.mockReturnValue('Overdue')
    render(<HeistCard heist={baseHeist} status="active" />)
    expect(screen.getByText('Overdue')).toBeInTheDocument()
  })

  it('updates the countdown every minute', () => {
    vi.useFakeTimers()
    render(<HeistCard heist={baseHeist} status="active" />)
    expect(mockGetTimeRemaining).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(60000)
    expect(mockGetTimeRemaining).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  it('clears the interval on unmount', () => {
    vi.useFakeTimers()
    const { unmount } = render(<HeistCard heist={baseHeist} status="active" />)
    expect(mockGetTimeRemaining).toHaveBeenCalledTimes(1)
    unmount()
    vi.advanceTimersByTime(60000)
    expect(mockGetTimeRemaining).toHaveBeenCalledTimes(1) // no additional calls after unmount
    vi.useRealTimers()
  })
})

describe('HeistCardSkeleton', () => {
  it('renders without errors', () => {
    const { container } = render(<HeistCardSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
