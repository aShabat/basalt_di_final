import { ComponentProps, useEffect } from "react"
import { useNavigate } from "react-router"

export default function Redirect({ path }) {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(path)
  })
  return <>Redirecting</>
}
