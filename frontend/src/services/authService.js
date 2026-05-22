import apiConnector from './apiConnector'
import { endpoints } from './apis'

export const loginAPI = async (username, password) => {
  return await apiConnector.post(endpoints.LOGIN, { username, password })
}

export const registerAPI = async (username, password) => {
  return await apiConnector.post(endpoints.REGISTER, { username, password })
}

export const getMyBookmarksAPI = async () => {
  return await apiConnector.get(endpoints.GET_BOOKMARKS)
}
