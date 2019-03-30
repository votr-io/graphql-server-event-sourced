export interface User {
  id: string;
  email: string;
  type: UserType;
}

export type UserType = 'WEAK';
