import { jwtDecode } from "jwt-decode";

// This project runs entirely in mock mode: no real backend, just
// localStorage standing in for a users table + JWT-shaped tokens
// so the rest of the app can work exactly like it would against
// a real API later.

const base64UrlEncode = (obj) => {
  const str = JSON.stringify(obj);
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const generateMockJWT = (payload) => {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const mockSignature = btoa("MockSignatureForLearningPurposesOnly")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
};

export const register = async ({ name, email, password, role }) => {
  const users = JSON.parse(localStorage.getItem("rbac_users") || "[]");
  if (users.find((u) => u.email === email)) {
    throw new Error("An account with that email already exists");
  }
  users.push({ name, email, password, role: role || "User" });
  localStorage.setItem("rbac_users", JSON.stringify(users));
  return { message: "Registration successful" };
};

export const login = async ({ email, password }) => {
  const users = JSON.parse(localStorage.getItem("rbac_users") || "[]");
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.email,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + 3600, // 1 hour session
  };

  const token = generateMockJWT(payload);
  localStorage.setItem("rbac_token", token);
  return { token, user: { name: user.name, email: user.email, role: user.role } };
};

export const logout = () => {
  localStorage.removeItem("rbac_token");
};

export const getToken = () => localStorage.getItem("rbac_token");

export const getDecodedToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  const decoded = getDecodedToken();
  if (!decoded) return false;
  const now = Math.floor(Date.now() / 1000);
  if (decoded.exp && decoded.exp < now) {
    logout();
    return false;
  }
  return true;
};

// Convenience: current user's role, or null if signed out.
export const getRole = () => getDecodedToken()?.role || null;