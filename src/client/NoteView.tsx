import { useContext, useEffect, useRef, useState } from "react"
import { marked } from "marked"
import { useNavigate, useParams } from "react-router"
import { getNote, postNote } from "./api"
import UserContext from "./UserContext"
import Props from "./Props"

interface EditorProps extends Props {
  serverNote?: string
  //@ts-ignore
  onChange
}

function Editor({ serverNote, onChange, className, style }: EditorProps) {
  const editor = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (editor.current) editor.current.innerText = serverNote || ""
  }, [serverNote])

  //@ts-ignore
  function handleChange() {
    onChange(editor.current?.innerText)
  }
  return (
    <div
      className={className}
      style={{ ...style, overflow: "scroll", height: "100vh" }}
      ref={editor}
      contentEditable={"plaintext-only"}
      onInput={handleChange}
    ></div>
  )
}

interface MarkdownViewProps extends Props {
  clientNote?: string
}

function MarkdownView({ clientNote, className, style }: MarkdownViewProps) {
  const view = useRef<HTMLDivElement>(null)
  const parsed = clientNote ? marked.parse(clientNote) : ""

  const navigate = useNavigate()
  useEffect(() => {
    view.current?.addEventListener("click", (e) => {
      // @ts-ignore
      const a = e.target?.closest("a")
      if (!a) return
      const url = new URL(a.href)
      console.log(url)
      if (url.origin === window.location.origin) {
        e.preventDefault()
        navigate(url.pathname)
      }
    })
  }, [])
  return (
    <div
      className={className}
      style={{ ...style, overflow: "scroll", height: "80vh" }}
      dangerouslySetInnerHTML={{ __html: parsed }}
      ref={view}
    ></div>
  )
}

interface NoteProps extends Props {
  edit: boolean
  setEdit: Function
}
export default function NoteView({
  edit,
  setEdit,
  className,
  style,
}: NoteProps) {
  const [serverNote, setServerNote] = useState<string>()
  const [clientNote, setClientNote] = useState<string>()

  const [user, _] = useContext(UserContext)
  const path = useParams()["*"]

  function toggleEdit() {
    setEdit(!edit)
  }

  async function handleSave() {
    const status = await postNote(
      user!,
      path!.slice(0, path!.lastIndexOf("/")),
      {
        kind: "note",
        title: path!.split("/").slice(-1)[0],
        content: clientNote,
      },
    )
    if (status === 200) setServerNote(clientNote)
  }

  useEffect(() => {
    ;(async () => {
      if (!user || !path) return
      const c = await getNote(user, path)
      setServerNote(c)
      setClientNote(c)
    })()
  }, [path])
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "50px 1fr",
      }}
    >
      <div style={{ gridRow: 1 }}>
        <button onClick={toggleEdit}> edit </button>
        {edit ? <button onClick={handleSave}>save</button> : <></>}
      </div>
      {edit ? (
        <Editor
          serverNote={serverNote}
          onChange={setClientNote}
          style={{ gridRow: 2, gridColumn: 1 }}
        />
      ) : (
        <></>
      )}
      {clientNote ? (
        <MarkdownView
          clientNote={clientNote}
          style={{ gridRow: 2, gridColumn: edit ? 2 : "1/3" }}
        />
      ) : (
        <>here will be graph</>
      )}
    </div>
  )
}
