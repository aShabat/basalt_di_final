import jwt from "jsonwebtoken"
import config from "./config.js"
import type { NextFunction, Response, Request } from "express"
import type { User } from "./types.js"

export function sign(user: User) {
  return jwt.sign(user, config.JWT_SECRET, { expiresIn: 60 * 60 })
}

export function verify(token: string) {
  try {
    return jwt.verify(token, config.JWT_SECRET) as User
  } catch (err) {
    return undefined
  }
}

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const token = req.cookies["AuthToken"]
  req.user = verify(token)
  next()
}
