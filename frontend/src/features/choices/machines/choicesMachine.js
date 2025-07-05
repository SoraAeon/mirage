import { createMachine } from 'xstate';

export const choicesMachine = createMachine({
  id: 'choices',
  initial: 'unauth',
  context: {
    username: '',
    email: '',
    password: ''
  },
  states: {
    unauth: {
      on: { SIGNUP: 'signup' }
    },
    signup: {
      on: { LOGIN: 'unauth' }
    }
    // ...他のstateもOK
  }
});
