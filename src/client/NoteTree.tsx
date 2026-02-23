import { useContext, useState } from "react"
import { ApiFolder } from "../server/types"
import { useNavigate } from "react-router"
import UserContext from "./UserContext"

interface NoteRowProps {
  title: string
  path: string
}

function NoteRow({ title, path }: NoteRowProps) {
  const navigate = useNavigate()
  function handleClick() {
    navigate(path)
  }
  return <li onClick={handleClick}>{title}</li>
}

interface FolderRowProps {
  folder: ApiFolder
  path: string
}
function FolderRow({ folder, path }: FolderRowProps) {
  const [open, setOpen] = useState(false)
  const children = folder.children.map((f) => (
    <FolderRow folder={f} path={`${path}/${f.title}`} />
  ))
  const notes = folder.notes.map((t) => (
    <NoteRow title={t} path={`${path}/${t}`} />
  ))

  function handleClick() {
    setOpen(!open)
  }
  return (
    <li>
      <span onClick={handleClick}>{folder.title}</span>
      {open ? (
        <ul>
          {children}
          {notes}
        </ul>
      ) : (
        <></>
      )}
    </li>
  )
}

interface TreeProps {
  className?: string
  root?: ApiFolder
}
export default function NoteTree({ className, root }: TreeProps) {
  const [user, _] = useContext(UserContext)
  return (
    <div className={className}>
      {root ? (
        <ul>
          {root.children.map((f) => (
            <FolderRow folder={f} path={`/${user}/${f.title}`} />
          ))}
        </ul>
      ) : (
        "empty"
      )}
    </div>
  )
}
