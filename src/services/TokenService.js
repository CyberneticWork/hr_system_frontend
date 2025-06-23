let token = null;

export function setToken(newToken) {
  token = newToken;
  if (newToken !== null) {
    localStorage.setItem("token", newToken);
  } else {
    localStorage.removeItem("token");
  }
}

export function getToken() {
  if (token !== null) {
    return token;
  }
  token = localStorage.getItem("token");
  return token;
}