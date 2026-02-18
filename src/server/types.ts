import { Request } from "express"

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

type Tree<N> = Record<string, N>
export interface NoteTree extends Tree<NoteTree | string> {}
