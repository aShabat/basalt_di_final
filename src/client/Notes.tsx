import { useEffect, useState } from "react"
import type { ApiFolder } from "../server/types"
import { getFolder } from "./api"
import { useNavigate, useParams } from "react-router"
import NoteTree from "./NoteTree"
import NoteView from "./NoteView"

interface Props {
  className?: string
}
export default function Notes({ className }: Props) {
  const [edit, setEdit] = useState(false)
  const { user } = useParams()
  const [root, setRoot] = useState<ApiFolder>()
  const navigate = useNavigate()

  // @ts-ignore
  function toggleEdit(e) {
    e.preventDefault()
    setEdit(!edit)
  }
  useEffect(() => {
    ;(async () => {
      if (!user) {
        navigate("/")
        return
      }
      const fetchRoot = await getFolder(user)
      if (fetchRoot && fetchRoot.kind === "folder") {
        setRoot(fetchRoot)
      }
    })()
  }, [])
  return (
    <div className={className}>
      <button onClick={toggleEdit}> edit </button>
      <NoteTree root={root} />
      <NoteView edit={edit} />
    </div>
  )
}
