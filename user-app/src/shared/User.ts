export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  userStatus: string;
  department: string;
}

export interface NewUser {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  userStatus: string;
  department: string;
}