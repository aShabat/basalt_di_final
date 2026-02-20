import { useContext } from "react"
import UserContext from "./UserContext"
import { NavLink, useNavigate } from "react-router"

export default function Navbar({ className }: { className: string }) {
  const [user, setUser] = useContext(UserContext)

  const navigate = useNavigate()
  function handleLogOut() {
    setUser(undefined)
    navigate("/")
  }

  return (
    <div className={className}>
      {user ? (
        <>
          <NavLink to="/login">log in</NavLink>
          <NavLink to="/signup">sign up</NavLink>
        </>
      ) : (
        <>
          <button onClick={handleLogOut}>log out</button>
        </>
      )}
    </div>
  )
}
