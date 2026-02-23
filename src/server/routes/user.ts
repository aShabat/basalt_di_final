import { Router } from "express"
import { createUser, getUser } from "../models/users.js"
import { sign } from "../auth.js"
import bcrypt from "bcrypt"

const router = Router()
const saltRounds = 13

router.get("/", async (req, res) => {
  if (req.user !== undefined) {
    res.send(req.user.name)
  } else {
    res.sendStatus(201)
  }
})

router.post("/", async (req, res) => {
  const { name, password } = req.body
  const { user, hash } = await getUser(name)
  const passwordMatch = await bcrypt.compare(password, hash)
  if (passwordMatch) {
    const token = sign(user)
    res.cookie("AuthToken", token, { httpOnly: true })
    res.status(200).json(user)
  } else {
    res.sendStatus(201)
  }
})

router.post("/new", async (req, res) => {
  const { name, password } = req.body
  const hash = await bcrypt.hash(password, saltRounds)
  const user = await createUser(name, hash)
  if (user !== undefined) {
    const token = sign(user)
    res.cookie("AuthToken", token, { httpOnly: true })
    res.status(200).json(user)
  } else {
    res.sendStatus(201)
  }
})

router.post("/logout", async (_, res) => {
  res.clearCookie("AuthToken").sendStatus(200)
})

export default router
