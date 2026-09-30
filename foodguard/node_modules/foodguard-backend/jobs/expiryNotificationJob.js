import cron from 'node-cron'
import { runExpiryNotificationJob } from '../src/services/notificationService.js'

export function startExpiryNotificationJob() {
  const timezone = process.env.APP_TIMEZONE || 'UTC'

  const runJob = async () => {
    try {
      const created = await runExpiryNotificationJob()
      console.log(`Expiry reminders checked: ${created.length} notifications created`)
    } catch (error) {
      console.error('Expiry notification job failed:', error.message)
    }
  }

  runJob()

  cron.schedule('0 9 * * *', runJob, {
    timezone,
  })

  console.log(`Expiry notification job started for timezone: ${timezone}`)
}
