import { describe, it, expect } from 'vitest'
import { generateCodename, adjectives, nouns, roles } from '@/lib/codename'

describe('generateCodename', () => {
  it('returns a non-empty string', () => {
    expect(generateCodename()).toBeTruthy()
  })

  it('returns a PascalCase string (each segment starts with uppercase)', () => {
    const codename = generateCodename()
    expect(codename).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+[A-Z][a-z]+$/)
  })

  it('produces different values across multiple calls', () => {
    const results = new Set(Array.from({ length: 20 }, () => generateCodename()))
    expect(results.size).toBeGreaterThan(1)
  })

  it('each segment comes from the correct word set', () => {
    for (let i = 0; i < 20; i++) {
      const codename = generateCodename()

      const adjMatch = adjectives.some(w =>
        codename.startsWith(w.charAt(0).toUpperCase() + w.slice(1))
      )
      expect(adjMatch).toBe(true)

      const nounMatch = nouns.some(w => {
        const cap = w.charAt(0).toUpperCase() + w.slice(1)
        return codename.includes(cap) && !codename.startsWith(cap)
      })
      expect(nounMatch).toBe(true)

      const roleMatch = roles.some(w => {
        const cap = w.charAt(0).toUpperCase() + w.slice(1)
        return codename.endsWith(cap)
      })
      expect(roleMatch).toBe(true)
    }
  })
})
