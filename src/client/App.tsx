import { Route, Routes } from "react-router"
import LogIn from "./LogIn"
import SignUp from "./SignUp"
import Notes from "./Notes"
import { useEffect, useState } from "react"
import UserContext from "./UserContext"
import { getUser } from "./api"
import Navbar from "./Navbar"
import Home from "./Home"

function App() {
  const ctx = useState<string>()

  useEffect(() => {
    const [_, setUser] = ctx
    ;(async () => {
      const user = await getUser()
      if (user) {
        setUser(user)
      }
    })()
  })

  return (
    <UserContext value={ctx}>
      <Navbar className="navbar" />
      <Routes>
        <Route path="/:user/*" element={<Notes />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </UserContext>
  )
}

export default App
