/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import yup from 'yup';
import Institute from '../models/Institute.js';

import helperFunctions from './helperFunctions.js';

const { faculties } = helperFunctions;

const instituteSchema = yup.object({
  name: yup.string().min(2, 'Enter at least 2 characters').required('Name is required'),
  email: yup.string().email('Enter a valid email').min(2, 'Enter a valid email').required('Email is required'),
  courses: yup.array().min(1, 'Enter at least 1 course').required('Courses are required'),
});

const updateInstituteSchema = yup.object({
  name: yup.string().min(2, 'Enter at least 2 characters'),
  email: yup.string().email('Enter a valid email').min(2, 'Enter a valid email'),
  courses: yup.array().min(1, 'Enter at least 1 course'),
});

// Resolvers
const allInstitutes = async () => {
  const result = await Institute.count();
  return result;
};

const institute = async (parent, args, context) => {
  const nullInstitute = { // For handling undefined on frontend
    _id: -1,
    name: 'N/A',
    email: 'N/A',
    courses: [],
    createdAt: new Date(),
    faculties: [],
  };
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  if (args._id === -1) return nullInstitute;
  const result = await Institute.findById(args._id);
  if (!result || !result._doc) {
    return nullInstitute;
  }
  return result._doc;
};

const institutes = async (parent, args) => {
  const query = Institute.find();
  // name filter; institute whose name starts with name given in arguments
  if (args.name) {
    query.where({ name: { $regex: new RegExp(args.name, 'ig') } }); // ig represent case-insensitive and globally in full string
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
  return result.map((inst) => ({
    ...inst._doc,
    faculties: helperFunctions.faculties.bind(this, inst._doc.faculties),
  }));
};

const newInstitute = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  await instituteSchema.validate(args); // Throws errors on invalid values
  let result;
  try {
    result = await Institute.create(args);
  } catch (e) {
    if (e.code === 11000) throw new Error('Email already exists');
    else throw e;
  }
  return {
    ...result._doc,
    faculties: faculties.bind(this, result._doc.faculties),
  };
};

const updateInstitute = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  await updateInstituteSchema.validate(args); // Throws errors on invalid values
  const oldInst = (await Institute.findById(args._id))?._doc;
  if (!oldInst) throw new Error('Institute not found');
  let result;
  const update = {
    ...args,
    _id: undefined, // id is undefined because updating it causes error since it is primary key
  };
  try {
    result = await Institute.findOneAndUpdate({ _id: args._id }, update, { new: true });
  } catch (e) {
    if (e.code === 11000) throw new Error('Email already exists');
    else throw e;
  }
  return result;
};

const deleteInstitute = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  await Institute.deleteOne({ _id: args._id });
  return args._id;
};

export default {
  queryResolvers: {
    allInstitutes,
    institutes,
    institute,
  },
  mutationResolvers: {
    newInstitute,
    updateInstitute,
    deleteInstitute,
  },
};
