import apiConnector from './apiConnector'
import { endpoints } from './apis'

export const fetchStoriesAPI = async (page = 1, limit = 10, config = {}) => {
  return await apiConnector.get(
    `${endpoints.GET_STORIES}?page=${page}&limit=${limit}`,
    config
  )
}

export const toggleBookmarkAPI = async (id) => {
  return await apiConnector.post(endpoints.TOGGLE_BOOKMARK(id))
}

export const getMyBookmarksAPI = async () => {
  return await apiConnector.get(endpoints.GET_BOOKMARKS)
}
