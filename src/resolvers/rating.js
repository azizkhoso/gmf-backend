/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import Rating from '../models/Rating.js';

import helperFunctions from './helperFunctions.js';

const {
  user,
  faculty,
  users,
  reports,
} = helperFunctions;

// Resolvers
const ratings = async () => { // This ratings is different from one in helperFunctions.js
  const result = await Rating.find();
  if (!result) return [];
  return result.map((rate) => ({
    ...rate._doc,
    user: user.bind(this, rate._doc.user),
    faculty: faculty.bind(this, rate._doc.faculty),
    likes: users.bind(this, rate._doc.likes),
    disLikes: users.bind(this, rate._doc.disLikes),
    reports: reports.bind(this, rate._doc.reports),
  }));
};

export default {
  queryResolvers: {
    ratings,
  },
  mutationResolvers: {

  },
};
