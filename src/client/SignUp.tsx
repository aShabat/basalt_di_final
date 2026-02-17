import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router"
import { postUserNew } from "./api"

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
      const status = await postUserNew(name, password)
      if (status === 200) {
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
