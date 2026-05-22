// A centralized dictionary of every backend endpoint in our system.
// If the backend URL structure ever changes, we only need to update it here.
export const endpoints = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  GET_BOOKMARKS: '/auth/bookmarks',

  // Story endpoints
  GET_STORIES: '/stories',
  TOGGLE_BOOKMARK: (id) => `/stories/bookmark/${id}`,
}
