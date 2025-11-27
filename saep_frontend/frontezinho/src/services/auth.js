// src/services/auth.js
const ACCESS_KEY = 'saep_access'
const REFRESH_KEY = 'saep_refresh'
const USER_KEY = 'saep_user'

export function saveAuth({ access, refresh, user }) {
  if (access) localStorage.setItem(ACCESS_KEY, access)
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getAccessToken() {
    return localStorage.getItem("access");
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY)
}

export function getUser() {
  const s = localStorage.getItem(USER_KEY)
  return s ? JSON.parse(s) : null
}


export function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    window.location.href = "/";
  }
