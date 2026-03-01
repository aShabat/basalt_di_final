import { ApiLink } from "../types.ts"
import sql from "./sql.ts"

interface Link {
  is_global: boolean
  path: string
}
function findLinks(content: string): Link[] {
  const reg = /\[[^\[\]]*\]\(([\w\-_/]+)\)/g
  return Array.from(
    content.matchAll(reg).map((c) => {
      return { is_global: c[1][0] === "/", path: c[1] }
    }),
  )
}

export async function genLinks(user_id: number, path: string, content: string) {
  await sql.query("delete from links where user_id = $1 and path_from = $2", [
    user_id,
    path,
  ])

  const folder_path = path.slice(0, path.lastIndexOf("/") + 1)
  for (const link of findLinks(content)) {
    await sql.query(
      "insert into links (user_id, path_from, path_to) values ($1, $2, $3)",
      [user_id, path, link.is_global ? link.path : folder_path + link.path],
    )
  }
}

export async function getLinks(user: number) {
  const links = await sql.query(
    "select path_from, path_to, count(1) as weight from links where user_id = $1 group by path_from, path_to",
    [user],
  )
  return links.map(({ path_from, path_to, weight }) => ({
    from: path_from,
    to: path_to,
    weight: +weight,
  })) as ApiLink[]
}
