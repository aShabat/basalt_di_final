import type { User } from "../types.ts"
import sql from "./sql.js"

export async function getUser(name: string) {
  const [user] = await sql.query("select * from users where name = $1", [name])

  return user as User
}

export async function createUser(name: string, password: string) {
  const result = await sql.query(
    "insert into users (name, password) values ($1, $2) returning id, name, password",
    [name, password],
  )

  return result
}
