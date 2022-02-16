/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import Blog from '../models/Blog.js';

import helperFunctions from './helperFunctions.js';

const { admin } = helperFunctions;

// Resolvers
const blogs = async () => { // This blogs is different from one in helperFunctions.js
  const result = await Blog.find();
  if (!result) return [];
  return result.map((b) => ({
    ...b._doc,
    writtenBy: admin.bind(this, b._doc.writtenBy),
  }));
};

export default {
  queryResolvers: {
    blogs,
  },
  mutationResolvers: {

  },
};
