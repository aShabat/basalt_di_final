import { createContext } from "react"

const UserContext = createContext<[string | undefined, Function]>([
  undefined,
  () => {},
])
export default UserContext
