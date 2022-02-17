/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import Admin from '../models/Admin.js';

import helperFunctions from './helperFunctions.js';

const { blogs } = helperFunctions;

// Resolvers
const allAdmins = async () => {
  const result = await Admin.count();
  return result;
};

const admins = async () => { // This admins is different from one in helperFunctions.js
  const result = await Admin.find();
  if (!result) return [];
  return result.map((a) => ({
    ...a._doc,
    blogs: blogs.bind(this, a._doc.blogs),
  }));
};

const loggedAdmin = async (parent, args, context) => {
  if (!context.admin) throw new Error('Admin not loggedIn');
  const admin = await Admin.findOne({ email: context.admin.toLowerCase() });
  return { ...context, admin };
};

export default {
  queryResolvers: {
    allAdmins,
    admins,
    loggedAdmin,
  },
  mutationResolvers: {

  },
};
