import { Router } from "express"
import { Folder, Note, ApiFolder, ApiNote, ApiPostNote } from "../types.ts"
import { getUser } from "../models/users.ts"
import {
  createFolder,
  createNote,
  getFolders,
  getNote,
} from "../models/notes.ts"

const router = Router()

function folderToApi(folder: Folder): ApiFolder {
  return {
    kind: "folder",
    title: folder.title,
    children: folder.children.map(folderToApi),
    notes: folder.notes.map((n) => n.title),
  }
}

router.get("/:name", async (req, res) => {
  try {
    const { name } = req.params
    const { user } = await getUser(name)
    const folders = await getFolders(user.id)

    res.json(folderToApi(folders))
  } catch (err) {
    console.log(err)
    res.sendStatus(404)
  }
})

function findFolder(folders: Folder, path: string[]): Folder {
  const pathErr = new Error(`wrong path: ${path}`)
  if (path.length === 0) return folders

  const [first, ...rest] = path
  const matched = folders.children.filter((f) => f.title === first)
  if (matched.length === 1) return findFolder(matched[0], rest)
  throw pathErr
}
function findNote(folders: Folder, path: string[]): Note {
  const folder = findFolder(folders, path.slice(0, -1))
  const matched = folder.notes.filter((n) => n.title === path[path.length - 1])
  if (matched.length === 1) return matched[0]
  throw new Error(`wrong path: ${path}`)
}
router.get("/:name/*path", async (req, res) => {
  try {
    const { name, path } = req.params
    const { user } = await getUser(name)
    const folders = await getFolders(user.id)
    const id = findNote(folders, path).id
    const note = await getNote(id)
    res.send(note.content)
  } catch (err) {
    console.log(err)
    res.sendStatus(404)
  }
})

router.post("/:name/*path", async (req, res) => {
  try {
    const { name, path } = req.params
    if (name !== req.user?.name) {
      res.sendStatus(401)
      return
    }
    const body = req.body as ApiPostNote
    const { user } = await getUser(name)
    const folders = await getFolders(user.id)
    const parentFolder = findFolder(folders, path)
    if (body.kind === "folder") {
      const folder = await createFolder(user.id, parentFolder.id, body.title)
      res.json(folderToApi(folder))
    } else {
      const note = await createNote(
        user.id,
        parentFolder.id,
        body.title,
        body.content || "",
      )
      res.send(note.content)
    }
  } catch (err) {
    console.log(err)
    res.sendStatus(404)
  }
})

export default router
