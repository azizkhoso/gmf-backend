/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import Faculty from '../models/Faculty.js';
import Rating from '../models/Rating.js';
import User from '../models/User.js';

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
  // course filter
  if (args.course) {
    query.where('course').equals(args.course.toUpperCase());
  }
  // semester filter
  if (args.semester) {
    query.where({ semester: { $regex: new RegExp(args.semester, 'ig') } }); // ig represent case-insensitive and globally in full string
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

const newRating = async (parent, args, context) => {
  if (!context.user) throw new Error('Not logged in or session expired, please login');
  const foundRating = await Rating.findOne(
    {
      user: context._id,
      course: args.course.toUpperCase(),
      semester: args.semester,
      faculty: args.faculty,
    },
  );
  if (foundRating) {
    throw new Error(`Already rated this faculty on ${args.course} in ${args.semester}`);
  }
  const fac = await Faculty.findById(args.faculty);
  if (!fac || !fac._doc) throw new Error('Faculty not found');
  const usr = await User.findById(context._id);
  if (!usr || !usr._doc) throw new Error('User not found');
  // After passing all checks, creating rating record
  const rating = await Rating.create({ ...args, user: context._id });
  // Updating attribute of faculty and adding new rating in list
  const attributes = new Set([...fac.attributes, ...args.tags]);
  await fac.updateOne(
    {
      $set: { attributes: [...attributes] },
      $push: { ratings: rating._doc._id },
    },
  );
  // Adding new rating in list of the user's ratings
  await usr.updateOne({ $push: { ratings: rating._doc._id } });
  return {
    ...rating._doc,
    user: user.bind(this, rating._doc.user),
    faculty: faculty.bind(this, rating._doc.faculty),
  };
};

const addLike = async (parent, args, context) => {
  if (!context.user) throw new Error('Not logged in or session expired, please login');
  const rating = await Rating.findOne({ _id: args.rating });
  if (!rating || !rating._doc) throw new Error('Rating not found');
  if (rating.likes.includes(context._id)) {
    await rating.update(
      { $pull: { likes: context._id } },
    );
    return rating.likes.length;
  }
  await Rating.findOneAndUpdate(
    { _id: args.rating },
    {
      $push: { likes: context._id },
      $pull: { disLikes: context._id },
    },
  );
  return rating.likes.length + 1;
};

const addDisLike = async (parent, args, context) => {
  if (!context.user) throw new Error('Not logged in or session expired, please login');
  const rating = await Rating.findOne({ _id: args.rating });
  if (!rating || !rating._doc) throw new Error('Rating not found');
  if (rating.disLikes.includes(context._id)) {
    await rating.update(
      { $pull: { disLikes: context._id } },
    );
    return rating.likes.length;
  }
  await Rating.findOneAndUpdate(
    { _id: args.rating },
    {
      $push: { disLikes: context._id },
      $pull: { likes: context._id },
    },
  );
  return rating.disLikes.length + 1;
};

const saveFaculty = async (parent, args, context) => {
  if (!context.user) throw new Error('Not logged in or session expired, please login');
  const usr = await User.findOne({ _id: context._id });
  if (usr.savedFaculties.includes(args.faculty)) {
    const updated = await User.findOneAndUpdate({ _id: context._id }, {
      $pull: { savedFaculties: args.faculty },
    }, { new: true });
    return updated.savedFaculties;
  }
  const updated = await User.findOneAndUpdate({ _id: context._id }, {
    $push: { savedFaculties: args.faculty },
  }, { new: true });
  return updated.savedFaculties;
};

const adminDeleteRating = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  await Rating.deleteOne({ _id: args._id });
  return args._id;
};

const deleteRating = async (parent, args, context) => {
  if (!context.user) throw new Error('Not logged in or session expired, please login');
  const ratng = await Rating.findOne({ user: context._id, _id: args._id });
  // Check if the rating is given by the user who is deleting it
  if (ratng && ratng._doc) {
    await User.updateOne({ _id: context._id }, { $pull: { ratings: args._id } });
    const fac = await Faculty.findById({ _id: ratng.faculty });
    if (fac && fac._doc) { // for null safety
      await Faculty.updateOne({ _id: ratng.faculty }, { $pull: { ratings: args._id } });
    }
    await Rating.deleteOne({ _id: args._id });
    if (fac && fac._doc) { // for null safety
      // Updating attributes of Faculty
      // Removing current rating's attributes
      await fac.updateOne({ $pull: { attributes: { $in: ratng.tags } } });
      // Calculating new attributes
      // getting attributes of all ratings of the faculty
      const ratingsAndTags = await Rating.find(
        { _id: { $in: fac._doc.ratings } },
        { _id: 1, tags: 1 },
      );
      const overAllAttributes = new Set(); // Set automatically ignores duplicate values
      ratingsAndTags.forEach((r) => {
        r._doc.tags.forEach((t) => overAllAttributes.add(t));
      });
      fac.updateOne({ $set: { attributes: [...overAllAttributes] } });
    }
  } else throw new Error('Rating not found in your account');
  return args._id;
};

export default {
  queryResolvers: {
    allRatings,
    ratings,
  },
  mutationResolvers: {
    newRating,
    addLike,
    addDisLike,
    saveFaculty,
    adminDeleteRating,
    deleteRating,
  },
};
