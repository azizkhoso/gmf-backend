/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import Faculty from '../models/Faculty.js';

import helperFunctions from './helperFunctions.js';

const { institute, ratings } = helperFunctions;

// Resolvers
const allFaculties = async () => {
  const result = await Faculty.count();
  return result;
};

const faculties = async () => { // This faculties is different from one in helperFunctions.js
  const result = await Faculty.find();
  if (!result) return [];
  return result.map((fac) => ({
    ...fac._doc,
    institute: institute.bind(this, fac._doc.institute),
    ratings: ratings.bind(this, fac._doc.ratings),
  }));
};

export default {
  queryResolvers: {
    allFaculties,
    faculties,
  },
  mutationResolvers: {

  },
};
