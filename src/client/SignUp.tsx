import axios from "axios"
import { useContext, useState } from "react"
import { useNavigate } from "react-router"
import { postUserNew } from "./api"
import UserContext from "./UserContext"

export default function SignUp() {
  const [_, setUser] = useContext(UserContext)
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

  // @ts-ignore
  async function handleSubmit(event) {
    event.preventDefault()
    if (!validateInput()) {
      return
    }

    try {
      const { status, user } = await postUserNew(name, password)
      if (status === 200) {
        setUser(user)
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
      <label>Repeat Password: </label>
      <input
        name="passwor_repeat"
        value={secondPassword}
        onChange={(e) => setSecondPassword(e.target.value)}
      />
      <button onClick={handleSubmit}> Sign Up </button>
    </div>
  )
}
