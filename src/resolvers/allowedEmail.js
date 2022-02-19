/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import AllowedEmail from '../models/AllowedEmail.js';

// Resolvers
const allAllowedEmails = async () => {
  const result = await AllowedEmail.count();
  return result;
};

const allowedEmails = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in, please login first');
  const query = AllowedEmail.find();
  // name filter; institute whose name starts with name given in arguments
  if (args.emailDomain) {
    query.where({ emailDomain: { $regex: new RegExp(args.emailDomain, 'ig') } }); // ig represent case-insensitive and globally in full string
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

const newAllowedEmail = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in, please login first');
  const foundEmail = await AllowedEmail.findOne({ emailDomain: { $regex: new RegExp(`^${args.emailDomain.toLowerCase()}`, 'i') } });
  if (foundEmail) throw new Error('Email domain already exists');
  let result;
  try {
    result = await AllowedEmail.create(args);
  } catch (e) {
    if (e.code === 11000) throw new Error('Email domain already exists');
    else throw e;
  }
  return result;
};

const updateAllowedEmail = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in, please login first');
  const foundEmail = await AllowedEmail.findById(args._id);
  if (!foundEmail || !foundEmail._doc) throw new Error('Email not found');
  // If emailDomain is supplied in args, check if that already exists with different id
  if (args.emailDomain) {
    const anotherEmail = await AllowedEmail.findOne({ emailDomain: { $regex: new RegExp(args.emailDomain, 'ig') } });
    if (anotherEmail && anotherEmail._doc._id !== foundEmail._doc._id) throw new Error('Email Domain already exists');
  }
  const update = {
    ...args,
    _id: undefined,
  };
  const result = await AllowedEmail.findOneAndUpdate({ _id: args._id }, update, { new: true });
  return result;
};

const deleteEmail = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in, please login first');
  await AllowedEmail.deleteOne({ _id: args._id });
  return args._id;
};

export default {
  queryResolvers: {
    allAllowedEmails,
    allowedEmails,
  },
  mutationResolvers: {
    newAllowedEmail,
    updateAllowedEmail,
    deleteEmail,
  },
};
