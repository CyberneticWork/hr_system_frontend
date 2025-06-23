let user = null;

export function setUser(newUser) {
  user = newUser;
  if (newUser) {
    localStorage.setItem("user", JSON.stringify(newUser));
  } else {
    localStorage.removeItem("user");
  }
}

export function getUser() {
  if (user) return user;
  const stored = localStorage.getItem("user");
  if (stored) {
    user = JSON.parse(stored);
    return user;
  }
  return null;
}

export function clearUser() {
  user = null;
  localStorage.removeItem("user");
}