import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import { getNote } from "./api"
import UserContext from "./UserContext"

interface NoteProps {
  edit: boolean
}
export default function NoteView({ edit }: NoteProps) {
  const [contents, setContents] = useState<string>()
  const [user, _] = useContext(UserContext)
  const path = useParams()["*"]

  useEffect(() => {
    ;(async () => {
      if (!user || !path) return
      const c = await getNote(user, path)
      setContents(c)
    })()
  })
  return <>{contents ? contents : <>{user}</>}</>
}
