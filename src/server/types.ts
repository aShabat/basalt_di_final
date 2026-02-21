export interface User {
  id: number
  name: string
}

declare global {
  namespace Express {
    export interface Request {
      user: User | undefined
    }
  }
}

export interface Note {
  kind: "note"
  id: number
  title: string
  contents: string
}

export interface Folder {
  kind: "folder"
  id: number | undefined
  title: string
  notes: Note[]
  subfolders: Folder[]
}

export interface ApiNote extends Omit<Note, "id"> {}

export interface ApiFolder extends Omit<Folder, "id" | "notes" | "subfolders"> {
  notes: string[]
  subfolders: ApiFolder[]
}
