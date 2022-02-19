/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import yup from 'yup';
import Ad from '../models/Ad.js';

const newAdSchema = yup.object({
  title: yup.string().required('Title is required').min(2, 'Enter at least 2 characters'),
  locationId: yup.string().required('Location ID is required').min(2, 'Enter at least 2 characters'),
  code: yup.string().required('Code is required').min(2, 'Enter at least 2 characters'),
});

const updateAdSchema = yup.object({
  title: yup.string().min(2, 'Enter at least 2 characters'),
  locationId: yup.string().min(2, 'Enter at least 2 characters'),
  code: yup.string().min(2, 'Enter at least 2 characters'),
});

// Resolvers
const allAds = async () => {
  const result = await Ad.count();
  return result;
};

const ads = async (parent, args) => {
  const query = Ad.find();
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

const newAd = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in, please login first');
  await newAdSchema.validate(args); // throws errors on invalid inputs
  const foundAd = await Ad.findOne({ title: { $regex: new RegExp(`^${args.title.toLowerCase()}`, 'i') } });
  if (foundAd) {
    throw new Error('Ad already exists');
  }
  let ad;
  try {
    ad = Ad.create(args);
  } catch (e) {
    if (e.code === 11000) throw new Error('Ad title already exists');
    else throw new Error(e);
  }
  return ad;
};

const updateAd = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in, please login first');
  await updateAdSchema.validate(args); // throws errors on invalid inputs
  const foundAd = await Ad.findById(args._id);
  if (!foundAd || !foundAd._doc) throw new Error('Ad not found');
  // If title is supplied in args, check if that already exists with different id
  if (args.title) {
    const anotherAd = await Ad.findOne({ title: { $regex: new RegExp(args.title, 'ig') } });
    if (anotherAd && anotherAd._doc._id !== foundAd._doc._id) throw new Error('Ad title already exists');
  }
  let ad;
  try {
    ad = await Ad.findOneAndUpdate({ _id: args._id }, args, { new: true });
  } catch (e) {
    if (e.code === 11000) throw new Error('Ad title already exists');
    else throw new Error(e);
  }
  return ad._doc;
};

const deleteAd = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in, please login first');
  await Ad.deleteOne({ _id: args._id });
  return args._id;
};

export default {
  queryResolvers: {
    allAds,
    ads,
  },
  mutationResolvers: {
    newAd,
    updateAd,
    deleteAd,
  },
};
