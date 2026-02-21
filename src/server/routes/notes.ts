import { Router } from "express"
import { getNotes } from "../models/notes.ts"
import { Folder, Note } from "../types.ts"

const router = Router()

interface StrippedNote extends Omit<Note, "id"> {}

interface StrippedFolder extends Omit<Folder, "id" | "notes" | "subfolders"> {
  notes: string[]
  subfolders: StrippedFolder[]
}
function stripContents(item: Folder | Note): StrippedFolder | StrippedNote {
  if (item.kind === "note") {
    return {
      kind: "note",
      contents: item.contents,
      title: item.title,
    } as StrippedNote
  } else {
    return {
      kind: "folder",
      title: item.title,
      subfolders: item.subfolders.map(stripContents),
      notes: item.notes.map((n) => n.title),
    } as StrippedFolder
  }
}

function folderFind(folder: Folder, title: string): Folder | Note {
  const matchingFolders = folder.subfolders.filter((s) => s.title === title)
  if (matchingFolders.length === 1) return matchingFolders[0]
  const matchingNotes = folder.notes.filter((n) => n.title === title)
  if (matchingNotes.length === 1) return matchingNotes[0]
  throw new Error("error")
}
router.get("/:name/*path", async (req, res) => {
  const { name, path } = req.params
  if (req.user === undefined || req.user.name !== name) {
    res.sendStatus(401)
    return
  }

  try {
    let returnItem: Folder | Note = await getNotes(name)
    let step = 0
    while (returnItem.kind === "folder" && step < path.length) {
      returnItem = folderFind(returnItem, path[step])
      step++
    }
    if (step < path.length) throw new Error()

    res.json(stripContents(returnItem))
  } catch (_) {
    res.sendStatus(404)
  }
})
