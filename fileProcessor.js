require('dotenv').config()
const path = require('path')
const fs = require('fs')

const { BlobServiceClient } = require('@azure/storage-blob')

const connectionString = process.env.AZURE_STORAGE_CONTAINER_STRING
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME

const bloberviceClient = BlobServiceClient.fromConnectionString(connectionString)
const containerClient = bloberviceClient.getContainerClient(containerName)

function generateKey() {
	return Math.random().toString(36).substring(2, 10)
}

module.exports = {
	uploadFile: async function (file) {
		const publicKey = generateKey()
		const privateKey = generateKey()
		const blobName = publicKey
		const blockBlobClient = containerClient.getBlockBlobClient(blobName)
		// Saving file to the disk
		const stream = fs.createReadStream(file).pipe(blockBlobClient.uploadStream())
		await new Promise((resolve, reject) => {
			stream.on('error', reject)
			stream.on('finish', resolve)
		})
		return { publicKey, privateKey }
	},

	downloadFile: async function (publicKey, res) {
		const blobName = publicKey
		const blockBlobClient = containerClient.getBlockBlobClient(blobName)

		try {
			const downloadBlockBlobResponse = await blockBlobClient.download()
			const contentType = downloadBlockBlobResponse.contentType
			res.setHeader('Content-Type', contentType)
			downloadBlockBlobResponse.readableStreamBody.pipe(res)
		} catch (error) {
			res.sendStatus(404)
		}
	},

	deleteFile: async function (privateKey) {
		const blobName = privateKey
		const blockBlobCleint = containerClient.getBlockBlobClient(blobName)
		try {
			await blockBlobCleint.delete()
			return { message: 'File Deleted Successfully' }
		} catch (error) {
			throw error
		}
	},
}
