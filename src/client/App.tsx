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
      <div
        style={{
          display: "grid",
          gridTemplateRows: "50px 1fr",
          height: "80vh",
        }}
      >
        <Navbar className="navbar" style={{ gridRow: 1 }} />
        <Routes>
          <Route path="/:user/*" element={<Notes style={{ gridRow: 2 }} />} />
          <Route path="/login" element={<LogIn style={{ gridRow: 2 }} />} />
          <Route path="/signup" element={<SignUp style={{ gridRow: 2 }} />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </UserContext>
  )
}

export default App
