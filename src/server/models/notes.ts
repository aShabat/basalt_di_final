import { Folder, Note } from "../types.ts"
import sql from "./sql.ts"

interface FolderData {
  id: number
  parent_id: number | null
  title: string
}

interface NoteData {
  id: number
  parent_id: number | null
  title: string
  content?: string
}

function nullToUndefined<T>(value: T | null): T | undefined {
  if (value === null) return undefined
  return value
}
function generateFolder(
  folders: FolderData[],
  notes: NoteData[],
  id: number | null = null,
  title = "root",
): Folder {
  return {
    kind: "folder",
    id: nullToUndefined(id),
    title: title,
    children: folders
      .filter((f) => f.parent_id === id)
      .map((f) => generateFolder(folders, notes, f.id, f.title)),
    notes: notes
      .filter((n) => n.parent_id === id)
      .map(
        ({ id, title }) =>
          ({
            kind: "note",
            id: nullToUndefined(id),
            title: title,
          }) as Note,
      ),
  }
}

export async function getFolders(id: number) {
  const folders = (await sql.query(
    "select id, parent_id, title from folders where user_id = $1",
    [id],
  )) as FolderData[]
  const notes = (await sql.query(
    "select id, parent_id, title from notes where user_id = $1",
    [id],
  )) as NoteData[]

  let tree = generateFolder(folders, notes)
  return tree
}

export async function getNote(id: number) {
  const [note] = (await sql.query(
    "select id, parent_id, title, content from notes where id = $1",
    [id],
  )) as NoteData[]
  return {
    kind: "note",
    id: note.id,
    title: note.title,
    content: note.content,
  } as Note
}

export async function createFolder(
  user_id: number,
  parent_id: number | undefined,
  title: string,
) {
  const [folder] = (await sql.query(
    "insert into folders parent_id, user_id, title ($1, $2, $3) returning id, parent_id, title",
    [parent_id, user_id, title],
  )) as FolderData[]

  return {
    kind: "folder",
    id: folder.id || undefined,
    title: folder.title,
    children: [],
    notes: [],
  } as Folder
}

export async function createNote(
  user_id: number,
  parent_id: number | undefined,
  title: string,
  content: string,
) {
  const [note] = (await sql.query(
    "insert into notes (parent_id, user_id, title, content) values ($1, $2, $3, $4) on conflict on constraint user_folder_title do update set content=excluded.content returning id, parent_id, title, content",
    [parent_id, user_id, title, content],
  )) as NoteData[]
  return {
    kind: "note",
    id: note.id,
    title: note.title,
    content: note.content,
  } as Note
}
