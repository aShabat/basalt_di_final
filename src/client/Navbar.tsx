import { useContext } from "react"
import UserContext from "./UserContext"
import { useNavigate } from "react-router"

export default function Navbar({ className }: { className: string }) {
  const [user, setUser] = useContext(UserContext)

  const navigate = useNavigate()
  function handleLogIn() {
    navigate("/login")
  }
  function handleSignUp() {
    navigate("/signup")
  }
  function handleLogOut() {
    setUser(undefined)
    navigate("/")
  }

  return (
    <div className={className}>
      {user ? (
        <>
          <button onClick={handleLogOut}>log out</button>
        </>
      ) : (
        <>
          <button onClick={handleLogIn}>log in</button>
          <button onClick={handleSignUp}>sign up</button>
        </>
      )}
    </div>
  )
}
