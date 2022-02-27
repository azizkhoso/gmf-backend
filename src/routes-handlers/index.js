/* eslint-disable import/extensions */
import {
  adminLogin,
  userLogin,
} from './login.js';
import handleGoogleSignup from './handleGoogleSignup.js';
import handleContactUs from './handleContactUs.js';
import handleNewInstituteReq from './handleNewInstituteReq.js';
import handleNewFacultyReq from './handleNewFacultyReq.js';

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
  handleNewFacultyReq,
  handleNewInstituteReq,
  emailVerification,
  generateConfirmationCode,
  handleCodeConfirmation,
  handlePasswordReset,
  handleContactUs,
};
