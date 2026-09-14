import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5000/api/auth";

// Check if we are running in Mock Mode (default to true if no backend is running)
let useMock = localStorage.getItem("use_mock_backend") !== "false";

export const isMockMode = () => useMock;
export const setMockMode = (val) => {
  useMock = val;
  localStorage.setItem("use_mock_backend", val ? "true" : "false");
};

// Simple base64url helpers to construct custom mock JWTs
const base64UrlEncode = (obj) => {
  const str = JSON.stringify(obj);
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const generateMockJWT = (payload) => {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const mockSignature = "MockSignatureStringWithHMAC256AlgorithmSimulationOnly";
  const encodedSignature = btoa(mockSignature)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
};

export const register = async (userData) => {
  // userData: { name, email, password, role } — role is "Admin" | "User" | "Employee"
  if (useMock) {
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    if (users.find(u => u.email === userData.email)) {
      throw new Error("User already exists");
    }
    users.push({ ...userData, role: userData.role || "User" });
    localStorage.setItem("mock_users", JSON.stringify(users));
    return { message: "Mock registration successful" };
  }
  return axios.post(`${API_URL}/register`, userData);
};

export const login = async (userData) => {
  if (useMock) {
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    const user = users.find(
      (u) => u.email === userData.email && u.password === userData.password
    );
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      sub: user.email,
      name: user.name,
      email: user.email,
      role: user.role || "User",
      iat: now,
      exp: now + 3600 // 1 hour expiration
    };
    const token = generateMockJWT(payload);
    localStorage.setItem("token", token);
    return { token, user: { name: user.name, email: user.email, role: user.role || "User" } };
  }

  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      logout();
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const getDecodedToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
};

// Convenience helper: returns "Admin" | "User" | "Employee" | null
export const getRole = () => {
  const decoded = getDecodedToken();
  return decoded?.role || null;
};