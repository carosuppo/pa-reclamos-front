import { describe, expect, it } from 'bun:test'
import { NAVIGATION_ITEMS, NAVIGATION_ITEMS_BY_ROLE } from './navigation'

describe('navigation constants', () => {
  it('cliente tiene múltiples accesos configurados', () => {
    expect(NAVIGATION_ITEMS_BY_ROLE.cliente.length).toBeGreaterThanOrEqual(5)
  })

  it('cada item de cliente tiene label, href e icon', () => {
    NAVIGATION_ITEMS_BY_ROLE.cliente.forEach((item) => {
      expect(item.label.length).toBeGreaterThan(0)
      expect(item.href.startsWith('/')).toBe(true)
      expect(item.icon.length).toBeGreaterThan(0)
    })
  })

  it('empleado contiene rutas de reclamos y reportes', () => {
    const hrefs = NAVIGATION_ITEMS_BY_ROLE.empleado.map((item) => item.href)

    expect(hrefs).toContain('/reclamos-area')
    expect(hrefs).toContain('/reportes')
  })

  it('legacy export coincide con navegación de cliente', () => {
    expect(NAVIGATION_ITEMS).toEqual(NAVIGATION_ITEMS_BY_ROLE.cliente)
  })

  it('admin está inicializado como lista vacía', () => {
    expect(NAVIGATION_ITEMS_BY_ROLE.admin).toEqual([])
  })
})
