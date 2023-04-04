const request = require('supertest')
const application = require('../../index')

describe('Test file Upload API', () => {
	test('It should respond with 200 API status', async () => {
		const response = await request(application).post('/files').attach('file', 'test/test-file.txt')
		expect(response.statusCode).toBe(200)
	})
})

describe('Test file download API', () => {
	test('It should respond with 200 API status code', async () => {
		const response = await request(application).get('/files/publicKey')
		expect(response.statusCode).toBe(200)
	})
})

describe('Test file delete API', () => {
	test('It should respond with 200 API status code', async () => {
		const response = await request(application).delete('/files/privateKey')
		expect(response.statusCode).toBe(200)
	})
})
