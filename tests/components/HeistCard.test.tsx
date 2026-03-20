import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { HeistCard, HeistCardSkeleton } from '@/components/HeistCard'
import type { Heist } from '@/types/firestore'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

const baseHeist: Heist = {
  id: 'heist-1',
  title: 'Steal the Stapler',
  description: 'Hide the stapler in the jello',
  createdBy: 'user-1',
  createdByCodename: 'SwiftFoxAgent',
  assignedTo: 'user-2',
  assignedToCodename: 'SilentRavenSpy',
  deadline: new Date('2026-04-01'),
  finalStatus: null,
  createdAt: new Date('2026-03-20'),
}

describe('HeistCard', () => {
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
})

describe('HeistCardSkeleton', () => {
  it('renders without errors', () => {
    const { container } = render(<HeistCardSkeleton />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
