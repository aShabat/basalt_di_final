import { JSX, useContext, useEffect, useState } from "react"
import { ApiFolder } from "../server/types"
import { useNavigate } from "react-router"
import UserContext from "./UserContext"
import Props from "./Props"
import RowInput from "./RowInput"
import { postNote } from "./api"

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
  const [user, _] = useContext(UserContext)
  const [open, setOpen] = useState(false)
  const [children, setChildren] = useState(
    folder.children.map((f) => (
      <FolderRow folder={f} path={`${path}/${f.title}`} />
    )),
  )
  const [notes, setNotes] = useState(
    folder.notes.map((t) => <NoteRow title={t} path={`${path}/${t}`} />),
  )

  const [createFolder, setCreateFolder] = useState(false)
  const [createNote, setCreateNote] = useState(false)

  function toggleCreateFolder() {
    setCreateFolder(!createFolder)
  }
  function toggleCreateNote() {
    setCreateNote(!createNote)
  }

  function handleClick() {
    setOpen(!open)
  }
  async function handleCreateFolder(value: string) {
    const status = await postNote(user!, path.slice(path.indexOf("/", 1) + 1), {
      kind: "folder",
      title: value,
    })
    if (status === 200) {
      setCreateFolder(false)
      setChildren([
        <FolderRow
          folder={{ kind: "folder", title: value, notes: [], children: [] }}
          path={`${path}/${value}`}
        />,
        ...children,
      ])
    }
  }
  async function handleCreateNote(value: string) {
    const status = await postNote(user!, path.slice(path.indexOf("/", 1) + 1), {
      kind: "note",
      title: value,
      content: "",
    })
    if (status === 200) {
      setCreateNote(false)
      setNotes([<NoteRow title={value} path={`${path}/${value}`} />, ...notes])
    }
  }
  return (
    <li className={className} style={style}>
      <span onClick={handleClick}>{folder.title}</span>
      {open && (
        <>
          <button onClick={toggleCreateFolder}> f </button>
          <button onClick={toggleCreateNote}> n </button>
        </>
      )}
      {open && (
        <ul>
          {createFolder && <RowInput onSubmit={handleCreateFolder} />}
          {children}
          {createNote && <RowInput onSubmit={handleCreateNote} />}
          {notes}
        </ul>
      )}
    </li>
  )
}

interface TreeProps extends Props {
  root?: ApiFolder
}
export default function NoteTree({ className, style, root }: TreeProps) {
  const [user, _] = useContext(UserContext)
  const path = `/${user}`
  const [children, setChildren] = useState<JSX.Element[]>([])
  const [notes, setNotes] = useState<JSX.Element[]>([])

  useEffect(() => {
    console.log(root)
    if (!root) return
    setChildren(
      root.children.map((f) => (
        <FolderRow folder={f} path={`${path}/${f.title}`} />
      )),
    )
    setNotes(root.notes.map((t) => <NoteRow title={t} path={`${path}/${t}`} />))
  }, [root])

  const [createFolder, setCreateFolder] = useState(false)
  const [createNote, setCreateNote] = useState(false)

  function toggleCreateFolder() {
    setCreateFolder(!createFolder)
  }
  function toggleCreateNote() {
    setCreateNote(!createNote)
  }

  async function handleCreateFolder(value: string) {
    const status = await postNote(user!, "", {
      kind: "folder",
      title: value,
    })
    if (status === 200) {
      setCreateFolder(false)
      setChildren([
        <FolderRow
          folder={{ kind: "folder", title: value, notes: [], children: [] }}
          path={`${path}/${value}`}
        />,
        ...children!,
      ])
    }
  }
  async function handleCreateNote(value: string) {
    const status = await postNote(user!, "", {
      kind: "note",
      title: value,
      content: "",
    })
    if (status === 200) {
      setCreateNote(false)
      setNotes([<NoteRow title={value} path={`${path}/${value}`} />, ...notes!])
    }
  }
  return (
    <div className={className} style={style}>
      <button onClick={toggleCreateFolder}>f</button>
      <button onClick={toggleCreateNote}>n</button>
      {root ? (
        <ul>
          {createFolder && <RowInput onSubmit={handleCreateFolder} />}
          {createNote && <RowInput onSubmit={handleCreateNote} />}
          {children}
          {notes}
        </ul>
      ) : (
        "empty"
      )}
    </div>
  )
}
