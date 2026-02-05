import { describe, expect, it, vi } from 'bun:test'
import { decodeJWT, isTokenExpired } from './jwt'

function createToken(payload: Record<string, unknown>) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${header}.${body}.signature`
}

describe('decodeJWT', () => {
  it('decodifica payload válido', () => {
    const token = createToken({ sub: '123', role: 'cliente', email: 'mail@test.com' })
    const decoded = decodeJWT(token)

    expect(decoded).not.toBeNull()
    expect(decoded?.sub).toBe('123')
    expect(decoded?.role).toBe('cliente')
    expect(decoded?.email).toBe('mail@test.com')
  })

  it('retorna null cuando el formato no tiene 3 partes', () => {
    expect(decodeJWT('invalid.token')).toBeNull()
    expect(decodeJWT('just-one-part')).toBeNull()
  })

  it('retorna null cuando el payload no es JSON', () => {
    const badPayload = Buffer.from('not-json').toString('base64url')
    const token = `header.${badPayload}.signature`

    expect(decodeJWT(token)).toBeNull()
  })

  it('loggea error en consola cuando falla decode', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    decodeJWT('bad-token')

    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})

describe('isTokenExpired', () => {
  it('retorna false para token no expirado', () => {
    const future = Math.floor(Date.now() / 1000) + 60
    const token = createToken({ exp: future })

    expect(isTokenExpired(token)).toBe(false)
  })

  it('retorna true para token expirado', () => {
    const past = Math.floor(Date.now() / 1000) - 60
    const token = createToken({ exp: past })

    expect(isTokenExpired(token)).toBe(true)
  })

  it('retorna true para token sin exp', () => {
    const token = createToken({ sub: 'abc' })

    expect(isTokenExpired(token)).toBe(true)
  })

  it('retorna true para token inválido', () => {
    expect(isTokenExpired('invalid')).toBe(true)
  })
})
