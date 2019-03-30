import { User } from './types';
import { db } from '../db';

export interface UserStore {
  createUser(user: User): Promise<User>;
  getUsers(ids: string[]): Promise<User[]>;
  getUsersByEmail(emails: string[]): Promise<User[]>;
  deleteUsers(ids: string[]): Promise<void>;
}

export const postgresUserStore: UserStore = {
  createUser: async user => {
    const { id, email, type } = user;
    await db.none(
      'INSERT INTO users (id, email, type) VALUES($(id), $(email), $(type));',
      {
        id,
        email,
        type,
      }
    );
    return user;
  },
  getUsers: async ids => {
    return await db.any('SELECT * FROM users WHERE id IN ($1:csv);', ids);
  },
  getUsersByEmail: async emails => {
    return await db.any('SELECT * FROM users WHERE email IN ($1:csv);', emails);
  },
  deleteUsers: async ids => {
    await db.none('delete FROM users WHERE id IN ($1:csv);', ids);
  },
};
