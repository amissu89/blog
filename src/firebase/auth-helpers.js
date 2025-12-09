// src/firebase/auth-helpers.js
import { observeAuthState } from './firebase-app.js';

/**
 * Gets the current authenticated user from Firebase.
 * @returns {Promise<import('firebase/auth').User|null>} A promise that resolves with the user object if logged in, or null if not.
 */
export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = observeAuthState(user => {
      unsubscribe();
      resolve(user);
    });
  });
};
