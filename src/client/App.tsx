import { Route, Routes } from "react-router"
import LogIn from "./LogIn"
import SignUp from "./SignUp"
import Notes from "./Notes"
import Redirect from "./Redirect"
import { useEffect, useState } from "react"
import UserContext from "./UserContext"
import { User } from "../server/types"
import { getUser } from "./api"
import Navbar from "./Navbar"

function App() {
  const ctx = useState(undefined as User | undefined)

  useEffect(() => {
    const [_, setUser] = ctx
    ;(async () => {
      const user = await getUser()
      if (user) {
        setUser(user)
      }
    })()
  }, [])

  return (
    <UserContext value={ctx}>
      <Navbar className="navbar" />
      <Routes>
        <Route path="/:user/*" element={<Notes />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Redirect path={"/notes"} />} />
      </Routes>
    </UserContext>
  )
}

export default App
