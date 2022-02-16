/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import Institute from '../models/Institute.js';

import helperFunctions from './helperFunctions.js';

// Resolvers
const institutes = async () => {
  const result = await Institute.find();
  if (!result) return [];
  return result.map((inst) => ({
    ...inst._doc,
    faculties: helperFunctions.faculties.bind(this, inst._doc.faculties),
  }));
};

export default {
  queryResolvers: {
    institutes,
  },
  mutationResolvers: {

  },
};
