import { useState } from "react"
import Props from "./Props"

interface RowInputProps extends Props {
  onSubmit?: Function
}

export default function RowInput({
  style,
  className,
  onSubmit,
}: RowInputProps) {
  const [value, setValue] = useState("")

  // @ts-ignore
  function handleChange(e) {
    setValue(e.target.value)
  }
  function handleSubmit() {
    onSubmit?.(value)
  }

  return (
    <div className={className} style={style}>
      <input type="text" value={value} onChange={handleChange} />
      <button onClick={handleSubmit}> ok </button>
    </div>
  )
}
