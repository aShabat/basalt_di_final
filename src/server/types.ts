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
  contents?: string
}

export interface ApiNote {
  kind: "note"
  title: string
  contents?: string
}

export interface Folder {
  kind: "folder"
  id: number | undefined
  title: string
  notes: Note[]
  children: Folder[]
}

export interface ApiFolder {
  kind: "folder"
  title: string
  notes: string[]
  children: ApiFolder[]
}
