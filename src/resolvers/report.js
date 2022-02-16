/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import Report from '../models/Report.js';

import helperFunctions from './helperFunctions.js';

const { user, rating } = helperFunctions;

// Resolvers
const reports = async () => { // This reports is different from one in helperFunctions.js
  const result = await Report.find();
  if (!result) return [];
  return result.map((report) => ({
    ...report._doc,
    user: user.bind(this, report._doc.user),
    rating: rating.bind(this, report._doc.rating),
  }));
};

export default {
  queryResolvers: {
    reports,
  },
  mutationResolvers: {

  },
};
