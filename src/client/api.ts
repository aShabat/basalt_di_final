import axios from "axios"
import { User } from "../server/types"

const axiosI = axios.create({ baseURL: "/api" })

export async function getUser() {
  const response = await axiosI.get("/user")
  if (response.status === 200) {
    return response.data as User
  } else {
    return undefined
  }
}

export async function postUser(name: string, password: string) {
  const response = await axiosI.post("/user", { name, password })
  return {
    status: response.status,
    user: response.status === 200 ? (response.data as User) : undefined,
  }
}

export async function postUserNew(name: string, password: string) {
  const response = await axiosI.post("/user/new", { name, password })
  return {
    status: response.status,
    user: response.status === 200 ? (response.data as User) : undefined,
  }
}

export async function postLogout() {
  axiosI.post("/user/logout")
}

