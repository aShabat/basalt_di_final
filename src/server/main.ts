import express from "express"
import ViteExpress from "vite-express"
import cookieParser from "cookie-parser"

import userRouter from "./routes/user.js"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/user", userRouter)

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
)
