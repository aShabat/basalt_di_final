import { useEffect, useState } from "react"
import type { ApiFolder } from "../server/types"
import { getFolderNote } from "./api"
import { useNavigate, useParams } from "react-router"
import NoteTree from "./NoteTree"

interface Props {
  className?: string
}
export default function Notes({ className }: Props) {
  const { user } = useParams()
  const [root, setRoot] = useState<ApiFolder>()
  const navigate = useNavigate()
  useEffect(() => {
    ;(async () => {
      if (!user) {
        navigate("/")
        return
      }
      const fetchRoot = await getFolderNote(user, [])
      if (fetchRoot && fetchRoot.kind === "folder") {
        setRoot(fetchRoot)
      }
    })()
  }, [])
  return (
    <div className={className}>
      <NoteTree root={root} />
    </div>
  )
}
