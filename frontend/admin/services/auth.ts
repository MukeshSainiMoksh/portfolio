import axios from "axios";
import { setToken, removeToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function login(username: string, password: string): Promise<void> {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const res = await axios.post(`${API_URL}/api/admin/auth/login`, formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  setToken(res.data.access_token);
}

export function logout(): void {
  removeToken();
}
