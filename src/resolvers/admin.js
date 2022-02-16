/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import Admin from '../models/Admin.js';

import helperFunctions from './helperFunctions.js';

const { blogs } = helperFunctions;

// Resolvers
const admins = async () => { // This admins is different from one in helperFunctions.js
  const result = await Admin.find();
  if (!result) return [];
  return result.map((a) => ({
    ...a._doc,
    blogs: blogs.bind(this, a._doc.blogs),
  }));
};

export default {
  queryResolvers: {
    admins,
  },
  mutationResolvers: {

  },
};
