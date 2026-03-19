import { cronJobs } from "convex/server"
import { internal } from "./_generated/api"

const crons = cronJobs()

crons.interval("sync npm packages", { minutes: 15 }, internal.packages.sync)
crons.interval("fetch all feeds", { hours: 2 }, internal.feed.fetchAllFeeds)
crons.weekly("purge old notifications", { dayOfWeek: "sunday", hourUTC: 3, minuteUTC: 0 }, internal.notifications.cleanupOld)

export default crons
