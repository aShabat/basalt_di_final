import { Route, Routes } from "react-router"
import "./App.css"
import LogIn from "./LogIn"
import SignUp from "./SignUp"
import Notes from "./Notes"
import Redirect from "./Redirect"

function App() {
  return (
    <Routes>
      <Route path="notes/*" element={<Notes />} />
      <Route path="login" element={<LogIn />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="*" element={<Redirect path={"/notes"} />} />
    </Routes>
  )
}

export default App
