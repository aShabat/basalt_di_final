import { useContext, useState } from "react"
import { useNavigate } from "react-router"
import { postUser } from "./api"
import UserContext from "./UserContext"
import Props from "./Props"

interface LogInProps extends Props {}
export default function LogIn({ className, style }: LogInProps) {
  const [_, setUser] = useContext(UserContext)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // @ts-ignore
  async function handleSubmit(event) {
    try {
      event.preventDefault()
      const { status, user } = await postUser(name, password)
      if (status === 200) {
        setUser(user)
        navigate(`/${name}`)
      } else {
        setError("Wrong account name or password.")
      }
    } catch (err) {
      setError("Network Error")
    }
  }

  return (
    <div className={className} style={style}>
      {error !== "" && <div> {error} </div>}
      <label>Name: </label>
      <input
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Password: </label>
      <input
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <button onClick={handleSubmit}> Log In </button>
    </div>
  )
}
