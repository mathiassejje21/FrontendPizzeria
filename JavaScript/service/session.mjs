export function setSessionUser(user) {
  sessionStorage.setItem("user", JSON.stringify(user));
}

export function getSessionUser() {
  const raw = sessionStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  sessionStorage.removeItem("user");
}
