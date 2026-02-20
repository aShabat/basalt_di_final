import { Route, Routes } from "react-router"
import LogIn from "./LogIn"
import SignUp from "./SignUp"
import Notes from "./Notes"
import Redirect from "./Redirect"
import { useEffect, useState } from "react"
import UserContext from "./UserContext"
import { User } from "../server/types"
import { getUser } from "./api"

function App() {
  const ctx = useState(undefined as User | undefined)

  useEffect(() => {
    ;(async () => {
      const user = await getUser()
      if (user) {
        const [_, setUser] = ctx
        setUser(user)
      }
    })()
  })

  return (
    <UserContext value={ctx}>
      <Routes>
        <Route path="notes/*" element={<Notes />} />
        <Route path="login" element={<LogIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="*" element={<Redirect path={"/notes"} />} />
      </Routes>
    </UserContext>
  )
}

export default App
