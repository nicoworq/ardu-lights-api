/* global describe, it, expect */

const request = require('supertest')

describe('Get Endpoints', () => {
  it('should return login template', async () => {
    const res = await request('http://localhost:3000')
      .get('/login')

    expect(res.statusCode).toEqual(200)
    expect(res.text).toContain('<title>Login')
  })

  it('should return dashboard template', async () => {
    const res = await request('http://localhost:3000')
      .get('/dashboard')

    expect(res.statusCode).toEqual(200)
    expect(res.text).toContain('<title>Dashboard')
  })
})
