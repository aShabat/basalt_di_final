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
  content?: string
}

export interface ApiNote {
  kind: "note"
  title: string
  content?: string
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

export interface ApiPostNote {
  kind: "folder" | "note"
  title: string
  content?: string
}
