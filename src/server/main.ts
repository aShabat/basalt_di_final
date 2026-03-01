import express from "express"
import ViteExpress from "vite-express"
import cookieParser from "cookie-parser"

import userRouter from "./routes/user.ts"
import notesRouter from "./routes/notes.ts"
import linksRouter from "./routes/links.ts"
import { authMiddleware } from "./auth.ts"

const app = express()

app.use((req, _, next) => {
  console.log(req.method, req.path)
  next()
})

app.use(express.json())
app.use(cookieParser())
app.use(authMiddleware)

app.use("/api/user", userRouter)
app.use("/api/notes", notesRouter)
app.use("/api/links", linksRouter)

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
)
