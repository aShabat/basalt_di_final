import axios from "axios"
import { useContext, useState } from "react"
import { useNavigate } from "react-router"
import { postUser } from "./api"
import UserContext from "./UserContext"

export default function LogIn() {
  const [_, setUser] = useContext(UserContext)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(event) {
    try {
      console.log("submit")
      event.preventDefault()
      const { status, user } = await postUser(name, password)
      if (status === 200) {
        setUser(user)
        navigate(`/${name}/notes`)
      } else {
        setError("Wrong account name or password.")
      }
    } catch (err) {
      setError("Network Error")
    }
  }

  return (
    <div className={"authForm"}>
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
      />
      <button onClick={handleSubmit}> Log In </button>
    </div>
  )
}
