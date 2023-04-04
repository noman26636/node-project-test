const express = require('express')
const multer = require('multer')
const limits = require('express-rate-limit')
const fileProcessor = require('./fileProcessor')
const { startCleanupJob } = require('./cleanUpJob')

const app = express()
const port = process.env.PORT || 3000

const upload = multer({ dest: 'uploads/' })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const apiLimiter = limits({
	windowMs: 24 * 60 * 60 * 1000,
	max: 100,
	message: 'Too many requests from this, please try again after an hour.',
	keyGenerator: function (req) {
		return req.ip
	},
})

startCleanupJob()

app.use(apiLimiter)

app.get('/', (req, res) => {
	res.send('I"m the root')
})

// Defining Routes
app.post('/files', upload.single('file'), (req, res) => {
	fileProcessor
		.uploadFile(req.file.path)
		.then(({ publicKey, privateKey }) => {
			res.json({ publicKey, privateKey })
		})
		.catch((err) => {
			res.status(500).send(err.message)
		})
})

app.get('/files/:publicKey', (req, res) => {
	fileProcessor.downloadFile(req.params.publicKey, res)
})

app.delete('/files/:privateKey', (req, res) => {
	fileProcessor
		.deleteFile(req.params.privateKey)
		.then(({ message }) => {
			res.json({ message })
		})
		.catch((err) => {
			res.status(500).send(err.message)
		})
})

// Server Setup to start

app.listen(port, () => {
	console.log(`Server listening at port ${port}`)
})
