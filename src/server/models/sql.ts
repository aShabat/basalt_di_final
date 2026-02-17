import { neon } from "@neondatabase/serverless"
import config from "../config"

export default neon(config.DATABASE_URL)
