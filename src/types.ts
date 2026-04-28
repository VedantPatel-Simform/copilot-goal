export type UserRole = "admin" | "user";

export type User = {
  id: number;
  username: string;
  // NOTE: In a production app passwords must be hashed server-side.
  // This is a client-only demo using localStorage.
  password: string;
  role: UserRole;
};

export type Session = {
  userId: number;
  username: string;
  role: UserRole;
};
