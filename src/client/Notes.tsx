import { useEffect, useState } from "react"
import type { ApiFolder } from "../server/types"
import { getFolder } from "./api"
import { useNavigate, useParams } from "react-router"
import NoteTree from "./NoteTree"
import NoteView from "./NoteView"
import Props from "./Props"

interface NotesProps extends Props {}
export default function Notes({ className, style }: NotesProps) {
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
    <div
      className={className}
      style={{
        ...style,
        display: "grid",
        gridTemplateColumns: "20% 1fr",
        gridTemplateRows: "50px 1fr",
      }}
    >
      <NoteTree root={root} style={{ gridRow: 2, gridColumn: 1 }} />
      <NoteView
        edit={edit}
        setEdit={setEdit}
        style={{ gridRow: 2, gridColumn: 2 }}
      />
    </div>
  )
}
