import { neon } from "@neondatabase/serverless"
import config from "../config.js"

export default neon(config.DATABASE_URL)
