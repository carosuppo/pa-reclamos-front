import { describe, expect, it } from 'bun:test'
import sleep from './sleep'

describe('sleep utility', () => {
  it('retorna una promesa', () => {
    const promise = sleep(1)

    expect(promise).toBeInstanceOf(Promise)
  })

  it('espera al menos el tiempo indicado', async () => {
    const start = Date.now()
    await sleep(30)
    const elapsed = Date.now() - start

    expect(elapsed).toBeGreaterThanOrEqual(20)
  })

  it('resuelve con undefined', async () => {
    const result = await sleep(1)

    expect(result).toBeUndefined()
  })
})
