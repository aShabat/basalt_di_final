import { Router } from "express"
import { Folder, Note, ApiFolder, ApiNote } from "../types.ts"
import { getUser } from "../models/users.ts"
import { getFolders, getNote } from "../models/notes.ts"

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

function findNote(folder: Folder, path: string[]): Note {
  const pathErr = new Error(`wrong path: ${path}`)
  if (path.length === 0) throw pathErr
  if (path.length === 1) {
    const matched = folder.notes.filter((n) => n.title === path[0])
    if (matched.length === 1) return matched[0]
    throw pathErr
  }

  const [first, ...rest] = path
  const matched = folder.children.filter((f) => f.title === first)
  if (matched.length === 1) return findNote(matched[0], rest)
  throw pathErr
}
router.get("/:name/*path", async (req, res) => {
  try {
    const { name, path } = req.params
    const { user } = await getUser(name)
    const folders = await getFolders(user.id)
    const id = findNote(folders, path).id
    const note = await getNote(id)
    res.json(note)
  } catch (err) {
    console.log(err)
    res.sendStatus(404)
  }
})

export default router
