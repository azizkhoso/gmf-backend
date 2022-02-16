/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import User from '../models/User.js';

import helperFunctions from './helperFunctions.js';

const { institute, faculties, ratings } = helperFunctions;

// Resolvers
const users = async () => { // This users is different from one in helperFunctions.js
  const result = await User.find();
  if (!result) return [];
  return result.map((user) => ({
    ...user._doc,
    institute: institute.bind(this, user._doc.institute),
    savedFaculties: faculties.bind(this, user._doc.savedFaculties),
    ratings: ratings.bind(this, user._doc.ratings),
  }));
};

export default {
  queryResolvers: {
    users,
  },
  mutationResolvers: {

  },
};
