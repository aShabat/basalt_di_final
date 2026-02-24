import { useContext, useState } from "react"
import { ApiFolder } from "../server/types"
import { useNavigate } from "react-router"
import UserContext from "./UserContext"
import Props from "./Props"

interface NoteRowProps extends Props {
  title: string
  path: string
}

function NoteRow({ title, path, className, style }: NoteRowProps) {
  const navigate = useNavigate()
  function handleClick() {
    navigate(path)
  }
  return (
    <li className={className} style={style} onClick={handleClick}>
      {title}
    </li>
  )
}

interface FolderRowProps extends Props {
  folder: ApiFolder
  path: string
}
function FolderRow({ folder, path, className, style }: FolderRowProps) {
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
    <li className={className} style={style}>
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

interface TreeProps extends Props {
  root?: ApiFolder
}
export default function NoteTree({ className, style, root }: TreeProps) {
  const [user, _] = useContext(UserContext)
  const children = root?.children.map((f) => (
    <FolderRow folder={f} path={`/${user}/${f.title}`} />
  ))
  const notes = root?.notes.map((t) => (
    <NoteRow title={t} path={`/${user}/${t}`} />
  ))
  return (
    <div className={className} style={style}>
      {root ? (
        <ul>
          {children}
          {notes}
        </ul>
      ) : (
        "empty"
      )}
    </div>
  )
}
