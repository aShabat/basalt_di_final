import { useState } from "react"
import { ApiFolder } from "../server/types"

interface NoteRowProps {
  title: string
}

function NoteRow({ title }: NoteRowProps) {
  return <li>{title}</li>
}

interface FolderRowProps {
  folder: ApiFolder
}
function FolderRow({ folder }: FolderRowProps) {
  const [open, setOpen] = useState(false)
  const children = folder.children.map((f) => <FolderRow folder={f} />)
  const notes = folder.notes.map((t) => <NoteRow title={t} />)

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
  return (
    <div className={className}>
      {root ? (
        <ul>
          {root.children.map((f) => (
            <FolderRow folder={f} />
          ))}
        </ul>
      ) : (
        "empty"
      )}
    </div>
  )
}
