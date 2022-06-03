/* global describe, it, expect */

const request = require('supertest')
const server = 'http://localhost:3000'
let jwt = ''

describe('Login test', () => {
  it('should return bad login', async () => {
    const res = await request(server)
      .post('/login')
      .send({
        username: 'random',
        password: 'random2'
      })

    expect(res.statusCode).toEqual(403)
    expect(res.body.logged).toEqual(false)
  })

  it('should return login ok', async () => {
    const res = await request(server)
      .post('/login')
      .send({
        username: 'nico',
        password: 'nico2022'
      })

    jwt = res.body.jwt
    expect(res.statusCode).toEqual(200)
    expect(res.body.logged).toEqual(true)
  })
})

describe('Protected endpoints', () => {
  it('should return access denied', async () => {
    const res = await request(server)
      .get('/api//mqtt-server-status')

    expect(res.statusCode).toEqual(401)
  })

  it('should return server port', async () => {
    const res = await request(server)
      .get('/api//mqtt-server-status')
      .set({
        'auth-token': jwt
      })

    expect(res.statusCode).toEqual(200)
    expect(res.body.port).not.toBe('')
  })
})
