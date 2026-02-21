import { Router } from "express"
import { getNotes } from "../models/notes.ts"
import { Folder, Note } from "../types.ts"

const router = Router()

function stripContents(f: Folder): Folder {
  return {
    ...f,
    subfolders: f.subfolders.map(stripContents),
    notes: f.notes.map((n) => ({ ...n, contents: "" })),
  }
}

router.get("/:name/tree", async (req, res) => {
  console.log("here")
  const name = req.params.name
  if (req.user === undefined || req.user.name !== name) {
    res.sendStatus(401)
    return
  }

  const rootFolder = await getNotes(name)

  res.json(stripContents(rootFolder))
})

function folderFind(folder: Folder, path: string[]): Folder | Note {
  if (path.length === 0) return folder
  const [p, ...rest] = path
  const matchingNotes = folder.notes.filter((n) => n.title === p)
  if (matchingNotes.length === 1 && path.length === 1) return matchingNotes[1]
  const matchingFolders = folder.subfolders.filter((f) => f.title === p)
  if (matchingFolders.length === 1) return folderFind(matchingFolders[0], rest)
  throw new Error("couldn't go along the path")
}

router.get("/:name/note/*path", async (req, res) => {
  const { name, path } = req.params
  if (req.user === undefined || req.user.name !== name) {
    res.sendStatus(401)
    return
  }

  let rootFolder = await getNotes(name)
  try {
    const note = folderFind(rootFolder, path)
    if (note.type === "note") {
      res.json(note)
    } else {
      res.sendStatus(404)
    }
  } catch (_) {
    res.sendStatus(404)
  }
})

export default router
