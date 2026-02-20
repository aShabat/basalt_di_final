import { Folder, Note } from "../types.ts"
import sql from "./sql.ts"
import { getUser } from "./users.ts"

interface FolderData {
  id: number | null
  parent_id: number | null
  title: string
}

interface NoteData {
  id: number
  parent_id: number | null
  title: string
  contents: string
}

function nullToUndefined<T>(value: T | null): T | undefined {
  if (value === null) return undefined
  return value
}
function genFolder(
  folders: FolderData[],
  notes: NoteData[],
  { id, title }: FolderData = { id: null, title: "root", parent_id: null },
): Folder {
  return {
    type: "folder",
    id: nullToUndefined(id),
    title: title,
    subfolders: folders
      .filter((f) => f.parent_id === id)
      .map((f) => genFolder(folders, notes, f)),
    notes: notes
      .filter((n) => n.parent_id === id)
      .map(
        ({ id, title, contents }) =>
          ({
            type: "note",
            id: nullToUndefined(id),
            title: title,
            contents: contents,
          }) as Note,
      ),
  }
}

export async function getNotes(name: string) {
  const { user } = await getUser(name)
  const folders = (await sql.query(
    "select id, parent_id, title from folders where user_id = $1",
    [user.id],
  )) as FolderData[]
  const notes = (await sql.query(
    "select id, parent_id, title, contents from notes where user_id = $1",
  )) as NoteData[]

  let tree = genFolder(folders, notes)
  return tree
}
