/* eslint-disable import/extensions */
import {
  adminLogin,
  userLogin,
} from './login.js';
import handleGoogleSignup from './handleGoogleSignup.js';
import handleContactUs from './handleContactUs.js';
import {
  emailVerification,
  generateConfirmationCode,
  handleCodeConfirmation,
  handlePasswordReset,
} from './resetPasswordHandlers.js';

export {
  adminLogin,
  userLogin,
  handleGoogleSignup,
  emailVerification,
  generateConfirmationCode,
  handleCodeConfirmation,
  handlePasswordReset,
  handleContactUs,
};
