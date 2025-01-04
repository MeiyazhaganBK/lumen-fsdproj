// Mock user data
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'Admin' },
  { id: 2, username: 'manager', password: 'manager123', role: 'Manager' },
  { id: 3, username: 'staff', password: 'staff123', role: 'Staff' },
];

export const login = (username, password) => {
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    return { ...user, password: undefined };
  }
  return null;
};

export const logout = () => {
  // In a real app, you'd clear tokens, etc.
  console.log('User logged out');
};

