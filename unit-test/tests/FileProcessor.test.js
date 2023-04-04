const fileProcessor = require('../../fileProcessor')

describe('Test fileProcessor file', () => {
	test('It should upload the file and return the keys', async () => {
		const result = await fileProcessor.uploadFile('path/to/file.txt')
		expect(typeof result.publicKey).toBe('string')
		expect(typeof result.privateKey).toBe('string')
	})

	test('It should throw an error if the file path is incorrect or invalid', async () => {
		await expect(fileProcessor.uploadFile('invalid/path')).rejects.toThrow('Invalid file path')
	})
})
