// signupMachine.js
import { createMachine, assign } from 'xstate';

export const signupMachine = createMachine({
  id: 'signup',
  initial: 'signup',
  context: {
    username: '',
    email: '',
    password: '',
  },
  states: {
    signup: {
      on: {
        SET_USERNAME: { actions: assign({ username: (_, e) => e.value }) },
        SET_EMAIL:    { actions: assign({ email:    (_, e) => e.value }) },
        SET_PASSWORD: { actions: assign({ password: (_, e) => e.value }) },
        SUBMIT:       'done',
        LOGIN:        'login'
      }
    },
    done: { type: 'final' },
    login: { /* ... */ }
  }
});
