import { beforeEach, describe, expect, it, mock } from 'bun:test'
import { clearAuthToken, saveAuthToken } from './auth-storage'

describe('auth-storage utilities', () => {
  beforeEach(() => {
    ;(globalThis as any).window = {
      localStorage: {
        data: {} as Record<string, string>,
        setItem(key: string, value: string) {
          this.data[key] = value
        },
        removeItem(key: string) {
          delete this.data[key]
        },
      },
    }
    ;(globalThis as any).document = { cookie: '' }
  })

  it('guarda token en localStorage y cookie', () => {
    saveAuthToken('abc123')

    expect((globalThis as any).window.localStorage.data.access_token).toBe('abc123')
    expect((globalThis as any).document.cookie).toContain('access_token=abc123')
  })

  it('limpia token en localStorage y cookie', () => {
    saveAuthToken('abc123')
    clearAuthToken()

    expect((globalThis as any).window.localStorage.data.access_token).toBeUndefined()
    expect((globalThis as any).document.cookie).toContain('access_token=;')
    expect((globalThis as any).document.cookie).toContain('expires=Thu, 01 Jan 1970 00:00:00 GMT')
  })

  it('no rompe en entorno sin window', () => {
    ;(globalThis as any).window = undefined

    expect(() => saveAuthToken('abc')).not.toThrow()
    expect(() => clearAuthToken()).not.toThrow()
  })

  it('ignora errores de localStorage al guardar', () => {
    ;(globalThis as any).window.localStorage.setItem = mock(() => {
      throw new Error('storage disabled')
    })

    expect(() => saveAuthToken('abc')).not.toThrow()
    expect((globalThis as any).document.cookie).toContain('access_token=abc')
  })

  it('ignora errores de cookie al limpiar', () => {
    Object.defineProperty((globalThis as any).document, 'cookie', {
      configurable: true,
      get: () => '',
      set: () => {
        throw new Error('cookie blocked')
      },
    })

    expect(() => clearAuthToken()).not.toThrow()
  })
})
