import { NoteTree } from "../types.ts"
import sql from "./sql.ts"
import { getUser } from "./users.ts"

interface Folder {
  id: number
  parent_id: number | null
  title: string
}

interface Note {
  id: number
  parent_id: number | null
  title: string
  contents: string
}

function folderSubTree(
  folders: Folder[],
  notes: Note[],
  id: number | null = null,
) {
  const tree: NoteTree = {}
  for (const folder of folders) {
    if (folder.parent_id === id) {
      tree[folder.title] = folderSubTree(folders, notes, folder.id)
    }
  }
  for (const note of notes) {
    if (note.parent_id === id) {
      tree[note.title] = note.contents
    }
  }
  return tree
}

export async function getNoteTree(name: string) {
  const { user } = await getUser(name)
  const folders = (await sql.query(
    "select id, parent_id, title from folders where user_id = $1",
    [user.id],
  )) as Folder[]
  const notes = (await sql.query(
    "select id, parent_id, title, contents from notes where user_id = $1",
  )) as Note[]

  let tree = folderSubTree(folders, notes)
  return tree
}
