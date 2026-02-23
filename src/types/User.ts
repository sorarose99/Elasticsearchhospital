export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  specialization?: string;
  department?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  permissions?: string[];
}

export interface DemoAccount {
  email: string;
  password: string;
  user: User;
}