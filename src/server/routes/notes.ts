import { Request, Response, Router } from "express"
import { getNotes } from "../models/notes.ts"
import { Folder, Note, ApiFolder, ApiNote } from "../types.ts"

const router = Router()

function stripContents(item: Folder | Note): ApiFolder | ApiNote {
  if (item.kind === "note") {
    return {
      kind: "note",
      contents: item.contents,
      title: item.title,
    } as ApiNote
  } else {
    return {
      kind: "folder",
      title: item.title,
      subfolders: item.subfolders.map(stripContents),
      notes: item.notes.map((n) => n.title),
    } as ApiFolder
  }
}

function folderFind(folder: Folder, title: string): Folder | Note {
  const matchingFolders = folder.subfolders.filter((s) => s.title === title)
  if (matchingFolders.length === 1) return matchingFolders[0]
  const matchingNotes = folder.notes.filter((n) => n.title === title)
  if (matchingNotes.length === 1) return matchingNotes[0]
  throw new Error("error")
}
async function handleGetNotes(req: Request, res: Response) {
  const name = req.params.name
  const path = req.params.path ? req.params.path : []
  console.log(name, path, req.user)
  if (req.user === undefined || req.user.name !== name) {
    res.sendStatus(401)
    return
  }

  try {
    let returnItem: Folder | Note = await getNotes(name)
    console.log(returnItem)
    let step = 0
    while (returnItem.kind === "folder" && step < path.length) {
      returnItem = folderFind(returnItem, path[step])
      step++
    }
    if (step < path.length) throw new Error()

    res.json(stripContents(returnItem))
  } catch (err) {
    console.log(err)
    res.sendStatus(404)
  }
}

router.get("/:name", handleGetNotes)
router.get("/:name/*path", handleGetNotes)

export default router
