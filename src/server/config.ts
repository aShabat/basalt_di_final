import { config } from "dotenv"

config()

function assert<T>(variable: T | undefined): T {
  if (variable === undefined) throw Error("undefined .env variable")
  else return variable
}

export default {
  DATABASE_URL: assert(process.env.DATABASE_URL),
  JWT_SECRET: assert(process.env.JWT_KEY),
}
