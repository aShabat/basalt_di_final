import { useContext, useEffect } from "react"
import { useNavigate } from "react-router"
import UserContext from "./UserContext"

export default function Home() {
  const navigate = useNavigate()
  const [user, _] = useContext(UserContext)
  useEffect(() => {
    if (user) navigate(`/${user}`)
  })
  return <>connecting</>
}
