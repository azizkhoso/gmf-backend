/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import yup from 'yup';
import Faq from '../models/Faq.js';

const newFaqSchema = yup.object({
  title: yup.string().required('Title is required').min(2, 'Enter at least 2 characters'),
  answer: yup.string().required('Answer is required').min(2, 'Enter at least 2 characters'),
  category: yup.mixed().oneOf(['Student', 'Teacher', 'General', 'Legals'], 'Please select one of Student, Teacher, Legals, or General').required('Category is required'),
});

const updateFaqSchema = yup.object({
  title: yup.string().min(2, 'Enter at least 2 characters'),
  answer: yup.string().min(2, 'Enter at least 2 characters'),
  category: yup.mixed().oneOf(['Student', 'Teacher', 'General', 'Legals'], 'Please select one of Student, Teacher, Legals, or General'),
});

// Resolvers
const allFaqs = async () => {
  const result = await Faq.count();
  return result;
};

const faqs = async (parent, args) => {
  const query = Faq.find();
  // name filter; institute whose name starts with name given in arguments
  if (args.title) {
    query.where({ title: { $regex: new RegExp(args.title, 'ig') } }); // ig represent case-insensitive and globally in full string
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
  return result;
};

const newFaq = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in, please login first');
  await newFaqSchema.validate(args); // throws errors on invalid inputs
  const foundFaq = await Faq.findOne({ title: { $regex: new RegExp(`^${args.title.toLowerCase()}`, 'i') } });
  if (foundFaq) throw new Error('Faq already exists');
  let result;
  try {
    result = await Faq.create(args);
  } catch (e) {
    if (e.code === 11000) throw new Error('Faq already exists');
    else throw e;
  }
  return result;
};

const updateFaq = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in, please login first');
  await updateFaqSchema.validate(args);
  const foundFaq = await Faq.findById(args._id);
  if (!foundFaq || !foundFaq._doc) throw new Error('Faq not found');
  // If title is supplied in args, check if that already exists with different id
  if (args.title) {
    const anotherFaq = await Faq.findOne({ title: { $regex: new RegExp(args.title, 'ig') } });
    if (anotherFaq && anotherFaq._doc._id !== foundFaq._doc._id) throw new Error('Faq title already exists');
  }
  const update = {
    ...args,
    _id: undefined,
  };
  const result = await Faq.findOneAndUpdate({ _id: args._id }, update, { new: true });
  return result;
};

const deleteFaq = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in, please login first');
  await Faq.deleteOne({ _id: args._id });
  return args._id;
};

export default {
  queryResolvers: {
    allFaqs,
    faqs,
  },
  mutationResolvers: {
    newFaq,
    updateFaq,
    deleteFaq,
  },
};
