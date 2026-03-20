import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTimeRemaining } from '@/lib/countdown'

describe('getTimeRemaining', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-20T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns Xd Yh format for multi-day deadlines', () => {
    const deadline = new Date('2026-03-22T16:00:00.000Z') // 2d 4h from now
    expect(getTimeRemaining(deadline)).toBe('2d 4h')
  })

  it('returns Xh Ym format for same-day deadlines', () => {
    const deadline = new Date('2026-03-20T16:42:00.000Z') // 4h 42m from now
    expect(getTimeRemaining(deadline)).toBe('4h 42m')
  })

  it('returns < 1m when under 1 minute remains', () => {
    const deadline = new Date('2026-03-20T12:00:30.000Z') // 30 seconds from now
    expect(getTimeRemaining(deadline)).toBe('< 1m')
  })

  it('returns Overdue when deadline is in the past', () => {
    const deadline = new Date('2026-03-20T11:59:00.000Z') // 1 minute ago
    expect(getTimeRemaining(deadline)).toBe('Overdue')
  })

  it('returns Overdue when deadline is exactly now', () => {
    const deadline = new Date('2026-03-20T12:00:00.000Z')
    expect(getTimeRemaining(deadline)).toBe('Overdue')
  })
})
