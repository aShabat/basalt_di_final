import axios from "axios"
import type { ApiFolder, ApiPostNote } from "../server/types"

const axiosI = axios.create({ baseURL: "/api" })

export async function getUser() {
  const response = await axiosI.get("/user")
  if (response.status === 200) {
    return response.data as string
  } else {
    return undefined
  }
}

export async function postUser(name: string, password: string) {
  const response = await axiosI.post("/user", { name, password })
  return {
    status: response.status,
    user: response.status === 200 ? (response.data as string) : undefined,
  }
}

export async function postUserNew(name: string, password: string) {
  const response = await axiosI.post("/user/new", { name, password })
  return {
    status: response.status,
    user: response.status === 200 ? (response.data as string) : undefined,
  }
}

export async function postLogout() {
  axiosI.post("/user/logout")
}

export async function getFolder(name: string) {
  const response = await axiosI.get(`/notes/${name}`)
  if (response.status !== 200) return undefined
  const data = response.data as ApiFolder
  return data
}

export async function getNote(user: string, path: string) {
  const response = await axiosI.get(`/notes/${user}/${path}`)
  return response.data as string
}

export async function postNote(user: string, path: string, note: ApiPostNote) {
  const response = await axiosI.post(
    `/notes/${user}${path === "" ? "" : "/" + path}`,
    note,
  )
  return response.status
}
