import { useEffect } from "react"
import { useNavigate } from "react-router"

interface Props {
  path: string
}
export default function Redirect({ path }: Props) {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(path)
  })
  return <>Redirecting</>
}
