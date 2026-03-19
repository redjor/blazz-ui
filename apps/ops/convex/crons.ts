import { cronJobs } from "convex/server"
import { internal } from "./_generated/api"

const crons = cronJobs()

crons.interval("sync npm packages", { minutes: 15 }, internal.packages.sync)
crons.interval("fetch all feeds", { hours: 2 }, internal.feed.fetchAllFeeds)

export default crons
