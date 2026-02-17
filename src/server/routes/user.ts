import express from "express"
import { createUser, getUser } from "../models/users.js"

const router = express.Router()

router.post("/", async (req, res) => {
  const { name, password } = req.body
  const user = await getUser(name)
  if (user.password === password) {
    res.sendStatus(200)
  } else {
    res.sendStatus(201)
  }
})

router.post("/new", async (req, res) => {
  const { name, password } = req.body
  const result = await createUser(name, password)
  if (result.length === 1) {
    res.sendStatus(200)
  } else {
    res.sendStatus(201)
  }
})

export default router
