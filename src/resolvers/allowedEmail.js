/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import AllowedEmail from '../models/AllowedEmail.js';

// Resolvers
const allAllowedEmails = async () => {
  const result = await AllowedEmail.count();
  return result;
};

const allowedEmails = async () => {
  const result = await AllowedEmail.find();
  if (!result) return [];
  return result;
};

export default {
  queryResolvers: {
    allAllowedEmails,
    allowedEmails,
  },
  mutationResolvers: {

  },
};
