import api from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: "admin" | "cashier" | "manager" | "inventory";
  status?: string;
  lastLogin?: string;
  created_at: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  username: string;
  password: string;
  role: "admin" | "cashier" | "manager" | "inventory";
}

export interface UpdateUserData {
  name: string;
  email: string;
  username: string;
  password?: string;
  role: "admin" | "cashier" | "manager" | "inventory";
}

class UserService {
  async getUsers(): Promise<User[]> {
    const response = await api.get("/users");
    return response.data;
  }

  async createUser(userData: CreateUserData): Promise<User> {
    const response = await api.post("/users", userData);
    return response.data;
  }

  async updateUser(id: number, userData: UpdateUserData): Promise<User> {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  }

  async getUser(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }
}

export default new UserService();
