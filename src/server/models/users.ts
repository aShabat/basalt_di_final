import type { User } from "../types.ts"
import sql from "./sql.js"

export async function getUser(name: string) {
  const [user] = await sql.query("select * from users where name = $1", [name])

  return { user: { id: user.id, name: user.name } as User, hash: user.password }
}

export async function createUser(name: string, password: string) {
  try {
    const [result] = (await sql.query(
      "insert into users (name, password) values ($1, $2) returning id, name",
      [name, password],
    )) as User[]

    return result
  } catch (err) {
    return undefined
  }
}
