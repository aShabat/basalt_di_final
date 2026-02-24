import { CSSProperties, useContext } from "react"
import UserContext from "./UserContext"
import { useNavigate } from "react-router"
import { postLogout } from "./api"
import Props from "./Props"

interface NavbarProps extends Props {}

export default function Navbar({ className, style }: NavbarProps) {
  const [user, setUser] = useContext(UserContext)

  const navigate = useNavigate()
  function handleLogIn() {
    navigate("/login")
  }
  function handleSignUp() {
    navigate("/signup")
  }
  // @ts-ignore
  function handleLogOut(event) {
    event.preventDefault()
    setUser(undefined)
    postLogout()
    navigate("/")
  }

  return (
    <div className={className} style={style}>
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
