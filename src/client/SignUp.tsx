import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router"

async function signup(name: string, password: string) {
  const response = await axios.post("/api/signup", { name, password })
  return response.status === 200
}

export default function SignUp() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [secondPassword, setSecondPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  function validateInput() {
    if (password !== secondPassword) {
      setError("Passwords do not match.")
      return false
    }
    return true
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    if (!validateInput()) {
      return
    }

    try {
      const signupOk = await signup(name, password)
      if (signupOk) {
        navigate(`/${name}/notes`)
      } else {
        setError("Signup error")
      }
    } catch (err) {
      setError("Api error.")
      console.log(err)
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
      <label>
        Repeat Password:{" "}
        <input
          name="passwor_repeat"
          value={secondPassword}
          onChange={(e) => setSecondPassword(e.target.value)}
        />
      </label>
      <button onClick={handleSubmit}> Sign Up </button>
    </>
  )
}
