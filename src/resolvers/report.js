/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import yup from 'yup';
import Rating from '../models/Rating.js';
import Report from '../models/Report.js';

import helperFunctions from './helperFunctions.js';

const { user, rating } = helperFunctions;

const newReportSchema = yup.object({
  rating: yup.number().min(0, 'Enter a valid rating id').required('Rating id is required'),
  summary: yup.string().min(4, 'Enter at least 4 characters').required('Summary is required'),
  details: yup.string().min(30, 'Enter at least 30 characters').required('Details is required'),
});

// Resolvers
const allReports = async () => {
  const result = await Report.count();
  return result;
};
// This reports is different from one in helperFunctions.js
const reports = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in, please login');
  const query = Report.find();
  // name filter; users whose first name starts with name given in arguments
  if (args.summary) {
    query.where({ summary: { $regex: new RegExp(args.summary, 'ig') } }); // ig represent case-insensitive and globally in full string
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
  return result.map((report) => ({
    ...report._doc,
    user: user.bind(this, report._doc.user),
    rating: rating.bind(this, report._doc.rating),
  }));
};

const newReport = async (parent, args, context) => {
  if (!context.user) throw new Error('Not logged in or session expired, please login');
  await newReportSchema.validate(args);
  const found = await Report.findOne({ user: context._id, rating: args.rating });
  if (found) throw new Error('Already reported on this rating');
  const report = await Report.create({ ...args, user: context._id });
  // Update the reports list in concerned rating
  await Rating.findOneAndUpdate({ _id: args.rating }, { $push: { reports: report._doc._id } });
  return {
    ...report._doc,
    user: user.bind(this, args.user),
    rating: rating.bind(this, args.rating),
  };
};

const deleteReport = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  const reprt = await Report.findById(args._id);
  if (!reprt || !reprt._doc) throw new Error('Report does not exist');
  // Deleting report from concerned rating
  await Rating.findOneAndUpdate({ _id: reprt._doc.rating }, { $pull: { reports: args._id } });
  // Deleting the report
  await reprt.deleteOne();
  return args._id;
};

export default {
  queryResolvers: {
    allReports,
    reports,
  },
  mutationResolvers: {
    newReport,
    deleteReport,
  },
};
