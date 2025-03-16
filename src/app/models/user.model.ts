export interface User {
  id?: string;
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface UserSimplified {
  username: string;
}
