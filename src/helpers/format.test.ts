import { describe, expect, it } from 'bun:test'
import { formatDate, formatDateTime } from './format'

describe('format helpers', () => {
  it('formatDate retorna string no vacío', () => {
    const result = formatDate(new Date('2024-01-15T10:30:00Z'))

    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('formatDate incluye año', () => {
    const result = formatDate(new Date('2023-06-01T00:00:00Z'))

    expect(result).toContain('2023')
  })

  it('formatDateTime incluye hora y minutos', () => {
    const result = formatDateTime(new Date('2024-08-20T14:45:00Z'))

    expect(result).toMatch(/\d{1,2}:\d{2}/)
  })

  it('formatDateTime incluye año', () => {
    const result = formatDateTime(new Date('2026-12-31T23:59:00Z'))

    expect(result).toContain('2026')
  })

  it('acepta dates como string parseable', () => {
    const result = formatDate('2024-07-10T12:00:00Z' as unknown as Date)

    expect(result.length).toBeGreaterThan(0)
  })
})
