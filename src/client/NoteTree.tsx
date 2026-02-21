import { ApiFolder } from "../server/types"

interface Props {
  className?: string
  root?: ApiFolder
}
export default function NoteTree({ className, root }: Props) {
  return (
    <div className={className}>
      {root ? (
        <ul>
          {root.subfolders.map((s) => (
            <li key={s.title}> {s.title} </li>
          ))}
        </ul>
      ) : (
        "empty"
      )}
    </div>
  )
}
