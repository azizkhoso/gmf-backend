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
const allRatings = async () => {
  const result = await Rating.count();
  return result;
};
// This ratings is different from one in helperFunctions.js
const ratings = async (parent, args) => {
  const query = Rating.find();
  // Date filter
  if (args.date) {
    // Ratings of month and year in given date are fetched
    // Hence for 2022-1-13, ratings from 2022-1-1 to 2022-1-31 are filtered
    const date = new Date(args.date);
    const startDate = new Date(date.getFullYear(), date.getMonth(), 0);// 30th or 31st of prev month
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1); // 1st of next month
    query.where('createdAt').gt(startDate).lt(endDate);
  }
  // user filter
  // comparing to zero deliberately because
  // Boolean(0) resolves to false and user with id zero is not matched
  if (args.user || args.user === 0) {
    query.where('user').equals(args.user);
  }
  // faculty filter
  // comparing to zero deliberately because
  // Boolean(0) resolves to false and faculty with id zero is not matched
  if (args.faculty || args.faculty === 0) {
    query.where('faculty').equals(args.faculty);
  }
  // offset filter
  if (args.offset) {
    query.skip(args.offset);
  }
  // limit filter
  if (args.limit) {
    query.limit(args.limit);
  }
  // -----------
  const result = await query.exec();
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
    allRatings,
    ratings,
  },
  mutationResolvers: {

  },
};
