import { Router } from "express"
import { getUser } from "../models/users.ts"
import { getLinks } from "../models/links.ts"

const router = Router()

router.get("/:name", async (req, res) => {
  const { name } = req.params
  if (name !== req.user?.name) {
    res.sendStatus(401)
    return
  }
  const { user } = await getUser(name)
  const links = await getLinks(user.id)
  res.json(links)
})

export default router
