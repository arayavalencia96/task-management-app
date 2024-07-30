import { v4 as uuidv4 } from 'uuid';

import { createReducer, on } from '@ngrx/store';

import {
  addUser,
  removeAllUsers,
  removeUser,
  updateUser,
} from './user.actions';

import { initialStateUsers } from '@data';

export const usersReducerFn = createReducer(
  initialStateUsers,
  on(addUser, (state, { name, username, email }) => ({
    ...state,
    users: [
      ...state.users,
      { id: uuidv4(), name, username, email, createdAt: new Date() },
    ],
  })),
  on(updateUser, (state, { userId, name, username, email }) => ({
    ...state,
    users: state.users.map(user =>
      user.id === userId
        ? { ...user, name, username, email, updatedAt: new Date() }
        : user
    ),
  })),
  on(removeUser, (state, { id }) => ({
    ...state,
    users: state.users.filter(user => user.id !== id),
  })),
  on(removeAllUsers, state => ({ ...state, users: [] }))
);
