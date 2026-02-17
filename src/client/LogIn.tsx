import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router"

async function login(name: string, password: string) {
  console.log("sending")
  const response = await axios.post("/api/login", { name, password })
  return response.status === 200
}

export default function LogIn() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(event: SubmitEvent) {
    try {
      console.log("submit")
      event.preventDefault()
      const loginOk = await login(name, password)
      if (loginOk) {
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
