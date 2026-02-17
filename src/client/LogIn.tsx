import axios from "axios"
import { MouseEvent, useState } from "react"
import { useNavigate } from "react-router"
import { postUser } from "./api"

export default function LogIn() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(event) {
    try {
      console.log("submit")
      event.preventDefault()
      const status = await postUser(name, password)
      if (status === 200) {
        navigate(`/${name}/notes`)
      } else {
        setError("Wrong account name or password.")
      }
    } catch (err) {
      setError("Network Error")
    }
  }

  return (
    <>
      {error !== "" && <div> {error} </div>}
      <label>
        Name:{" "}
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Password:{" "}
        <input
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button onClick={handleSubmit}> Log In </button>
    </>
  )
}
