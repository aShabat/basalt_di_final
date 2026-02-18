import { Router } from "express"
import { getNoteTree } from "../models/notes.ts"
import { NoteTree } from "../types.ts"

const router = Router()

function stripContents(tree: NoteTree) {
  const strippedTree = structuredClone(tree)
  for (const key in strippedTree) {
    if (typeof strippedTree[key] === "string") {
      strippedTree[key] = ""
    } else {
      strippedTree[key] = stripContents(strippedTree[key])
    }
  }
  return strippedTree
}

router.get(":name/tree", async (req, res) => {
  const name = req.params.name
  if (req.user === undefined || req.user.name !== name) {
    res.sendStatus(201)
    return
  }

  let tree = await getNoteTree(name)
  tree = stripContents(tree)

  res.json(tree)
})

router.get(":name/note/:path", async (req, res) => {
  const { name, path } = req.params
  console.log(path.split("/"))
  if (req.user === undefined || req.user.name !== name) {
    res.sendStatus(201)
    return
  }

  let tree: NoteTree | string = await getNoteTree(name)
  for (const p in path.split("/")) {
    if (typeof tree === "string" || tree[p] === undefined) {
      res.sendStatus(404)
      return
    } else {
      tree = tree[p]
    }
  }
  if (typeof tree !== "string") {
    res.sendStatus(404)
  } else {
    res.send(tree)
  }
})

export default router
