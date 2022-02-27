/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable no-promise-executor-return */
import yup from 'yup';
import fs from 'fs';
import Faculty from '../models/Faculty.js';
import Institute from '../models/Institute.js';

import helperFunctions from './helperFunctions.js';

const { institute, ratings } = helperFunctions;

const newFacultySchema = yup.object({
  firstName: yup.string().required('First name is required').min(2, 'Enter at least 2 characters'),
  lastName: yup.string(),
  email: yup.string().email('Enter a valid email'),
  department: yup.string().required('Department is required').min(6, 'Enter at least 6 characters'),
  institute: yup.number().min(0, 'Enter a valid institute').required('Institute is required'),
  courses: yup.array().min(1, 'Enter at least 1 course').required('Courses are required'),
});

const updateFacultySchema = yup.object({
  firstName: yup.string().min(2, 'Enter at least 2 characters'),
  lastName: yup.string(),
  email: yup.string().email('Enter a valid email'),
  department: yup.string().min(6, 'Enter at least 6 characters'),
  institute: yup.number().min(0, 'Enter a valid institute'),
  courses: yup.array().min(1, 'Enter at least 1 course'),
});

const storeFS = ({ stream }) => {
  const pth = 'many-faculties.json';
  return new Promise((resolve, reject) => stream
    .on('error', (error) => {
      reject(error);
    })
    .pipe(fs.createWriteStream(pth))
    // eslint-disable-next-line arrow-parens
    .on('error', error => reject(error))
    .on('finish', () => resolve({ path: pth })));
};

// Resolvers
const allFaculties = async () => {
  const result = await Faculty.count();
  return result;
};
// This faculties is different from one in helperFunctions.js
const faculties = async (parent, args) => {
  const query = Faculty.find();
  // name filter; institute whose first name starts with name given in arguments
  if (args.firstName) {
    query.where({ firstName: { $regex: new RegExp(args.firstName, 'ig') } }); // ig represent case-insensitive and globally in full string
  }
  // institute filter
  // comparing to zero deliberately because
  // Boolean(0) resolves to false and institute with id zero is not matched
  if (args.institute || args.institute === 0) {
    query.where({ institute: args.institute });
  }
  // 'in' filter
  if (args.in) {
    query.where('_id').in(args.in);
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
  return result.map((fac) => ({
    ...fac._doc,
    institute: institute.bind(this, fac._doc.institute),
    ratings: ratings.bind(this, fac._doc.ratings),
  }));
};

const newFaculty = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  await newFacultySchema.validate(args);
  // find faculty having same first name, last name, department and institute in any regard
  const query = Faculty.findOne(
    {
      firstName: args.firstName,
    },
  );
  const foundFac = await query.exec();
  if (foundFac && foundFac._doc) throw new Error('Faculty already exists');
  const instResult = await Institute.findById(args.institute);
  if (!instResult || !instResult._doc) throw new Error('Institute not found');
  let result;
  try {
    result = await Faculty.create(args);
    // New faculty should be listed in institute
    await instResult.updateOne({ $push: { faculties: result._doc._id } });
  } catch (e) {
    if (e.code === 11000) throw new Error('Faculty already exists');
    else throw e;
  }
  return {
    ...result._doc,
    institute: institute.bind(this, result._doc.institute),
    ratings: ratings.bind(this, result._doc.ratings),
  };
};

const newFaculties = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  if (!args.institute || args.institute === -1) throw new Error('Please enter institute');
  const { createReadStream } = await args.jsonFile;
  const stream = createReadStream();
  const file = await storeFS({ stream });
  const result = JSON.parse(fs.readFileSync(file.path).toString());
  // Validating records
  let i = 0;
  const newFacs = [];
  try {
    for (; i < result.length; i += 1) {
      const record = result[i];
      await newFacultySchema.validate(record);
      // Adding faculty to database
      const rec = await Faculty.create({ ...record, institute: args.institute });
      newFacs.push(rec);
    }
  } catch (e) {
    if (e.code === 11000) throw new Error(`Faculty ${result[i].firstName} already exists, subsequent records could not be processed`);
    else throw new Error(`For ${result[i].firstName}, ${e}, subsequent records could not be processed`);
  }
  return newFacs.map((fac) => ({
    ...fac._doc,
    institute: institute.bind(this, fac._doc.institute),
    ratings: ratings.bind(this, fac._doc.ratings),
  }));
};

const updateFaculty = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  await updateFacultySchema.validate(args);
  const facResult = await Faculty.findById(args._id);
  if (!facResult || !facResult._doc) throw new Error('Faculty not found');
  const instResult = await Institute.findById(facResult._doc.institute);
  if (!instResult || !instResult._doc) throw new Error('Institute not found');
  let result;
  try {
    // If institute is changed
    if (args.institute && (instResult._doc._id !== args.institute)) {
      // $pop is not used as it only removes first or last elements
      await instResult.updateOne({ $pull: { faculties: facResult._doc._id } });
      const newInst = await Institute.findById(args.institute);
      if (!newInst || !newInst._doc) throw new Error('Institute not found');
      await newInst.updateOne({ $push: { faculties: facResult._doc._id } });
    }
    // If institute is supplied in args but not changed
    result = await Faculty.findOneAndUpdate(
      { _id: args._id },
      { ...args, _id: undefined },
      { new: true },
    );
  } catch (e) {
    if (e.code === 11000) throw new Error('Faculty already exists');
    else throw e;
  }
  return {
    ...result._doc,
    institute: institute.bind(this, result._doc.institute),
    ratings: ratings.bind(this, result._doc.ratings),
  };
};

const deleteFaculty = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  const fac = await Faculty.findById(args._id);
  if (!fac || !fac._doc) throw new Error('Faculty not found');
  await Institute.findOneAndUpdate({ _id: fac._doc.institute }, { $pull: { faculties: args._id } });
  await fac.deleteOne();
  return args._id;
};

export default {
  queryResolvers: {
    allFaculties,
    faculties,
  },
  mutationResolvers: {
    newFaculty,
    newFaculties,
    updateFaculty,
    deleteFaculty,
  },
};
