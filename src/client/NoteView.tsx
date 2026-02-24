import { useContext, useEffect, useRef, useState } from "react"
import { marked } from "marked"
import { useLocation, useParams } from "react-router"
import { getNote } from "./api"
import UserContext from "./UserContext"

interface EditorProps {
  serverNote?: string
  //@ts-ignore
  onChange
}

function Editor({ serverNote, onChange }: EditorProps) {
  const editor = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (editor.current) editor.current.innerText = serverNote || ""
  }, [serverNote])

  //@ts-ignore
  function handleChange() {
    console.log(editor.current?.innerText)
    onChange(editor.current?.innerText)
  }
  return (
    <div
      ref={editor}
      contentEditable={"plaintext-only"}
      onInput={handleChange}
    ></div>
  )
}

interface MarkdownViewProps {
  clientNote?: string
}

function MarkdownView({ clientNote: clientNote }: MarkdownViewProps) {
  useEffect(() => {
    console.log(clientNote)
  }, [clientNote])

  const parsed = clientNote ? marked.parse(clientNote) : ""
  return <div dangerouslySetInnerHTML={{ __html: parsed }}></div>
}

interface NoteProps {
  edit: boolean
}
export default function NoteView({ edit }: NoteProps) {
  const [serverNote, setServerNote] = useState<string>()
  const [clientNote, setClientNote] = useState<string>()

  const [user, _] = useContext(UserContext)
  const path = useParams()["*"]

  useEffect(() => {
    ;(async () => {
      if (!user || !path) return
      const c = await getNote(user, path)
      setServerNote(c)
      setClientNote(c)
    })()
  }, [path])
  return (
    <>
      {edit ? (
        <Editor serverNote={serverNote} onChange={setClientNote} />
      ) : (
        <></>
      )}
      {clientNote ? (
        <MarkdownView clientNote={clientNote} />
      ) : (
        <>here will be graph</>
      )}
    </>
  )
}
