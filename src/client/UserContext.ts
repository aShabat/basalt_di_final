import { createContext } from "react"
import { User } from "../server/types"

const UserContext = createContext<[User | undefined, Function]>([
  undefined,
  () => {},
])
export default UserContext
