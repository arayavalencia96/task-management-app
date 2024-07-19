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
  on(addUser, (state, { user }) => ({
    ...state,
    users: [...state.users, { ...user, id: uuidv4() }],
  })),
  on(updateUser, (state, { userId, updatedUser }) => ({
    ...state,
    users: state.users.map(user => (user.id === userId ? updatedUser : user)),
  })),
  on(removeUser, (state, { id }) => ({
    ...state,
    users: state.users.filter(user => user.id !== id),
  })),
  on(removeAllUsers, state => ({ ...state, users: [] }))
);
