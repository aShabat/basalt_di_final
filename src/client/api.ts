import axios from "axios"

const axiosI = axios.create({ baseURL: "/api" })

export async function postUser(name: string, password: string) {
  const response = await axiosI.post("/user", { name, password })
  return response.status
}

export async function postUserNew(name: string, password: string) {
  const response = await axiosI.post("/user/new", { name, password })
  return response.status
}
