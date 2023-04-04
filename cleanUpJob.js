const cron = require('node-cron')
const fileProcessor = require('./fileProcessor')

const startCleanupJob = () => {
	// Run cleanup every day at midnight
	cron.schedule('0 0 * * *', function () {
		// Will perform cleanup
		fileProcessor.cleanupFiles()
	})
}

module.exports = { startCleanupJob }
