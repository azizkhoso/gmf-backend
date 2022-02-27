/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import yup from 'yup';
import Admin from '../models/Admin.js';

import helperFunctions from './helperFunctions.js';

const { blogs } = helperFunctions;

const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

const adminSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Enter at least 2 characters'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(8, 'Password should be at least 8 characters long').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
  facebookLink: yup.string().matches(urlRegex, 'Not a valid link'),
  instagramLink: yup.string().matches(urlRegex, 'Not a valid link'),
  twitterLink: yup.string().matches(urlRegex, 'Not a valid link'),
});

const updateAdminSchema = yup.object({
  name: yup.string().min(2, 'Enter at least 2 characters'),
  email: yup.string().email('Enter a valid email'),
  password: yup.string().min(8, 'Password should be at least 8 characters long'),
  newPassword: yup.string().min(8, 'Password should be at least 8 characters long'),
  facebookLink: yup.string().matches(urlRegex, 'Not a valid link'),
  instagramLink: yup.string().matches(urlRegex, 'Not a valid link'),
  twitterLink: yup.string().matches(urlRegex, 'Not a valid link'),
});

// Resolvers
const allAdmins = async () => {
  const result = await Admin.count();
  return result;
};
// This admins is different from one in helperFunctions.js
const admins = async (parent, args, context) => {
  console.log(context);
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  const query = Admin.find();
  // name filter; admin whose name starts with name given in arguments
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
  return result.map((a) => ({
    ...a._doc,
    blogs: blogs.bind(this, a._doc.blogs),
  }));
};

const loggedAdmin = async (parent, args, context) => {
  if (!context.admin) throw new Error('Admin not loggedIn');
  const admin = await Admin.findOne({ email: context.admin.toLowerCase() });
  return { ...context, admin };
};

const newAdmin = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  const admin = args;
  await adminSchema.validate(admin); // throws errors on invalid inputs
  let result;
  try {
    result = await Admin.create(admin);
  } catch (e) {
    if (e.code === 11000) throw new Error('Admin already exists');
    else throw e;
  }
  return result;
};

const updateAdmin = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  await updateAdminSchema.validate(args); // throws errors on invalid inputs
  const superAdmin = await Admin.findOne({ email: 'superadmin@email.com' });
  if (args._id === superAdmin._id) throw new Error('Can not update super admin');
  const admin = await Admin.findOne({ _id: args._id });
  if (!admin || !admin._doc) throw new Error('Admin not found');
  // To change password, old password should be correct
  if (args.password && (admin.password !== args.password)) throw new Error('Wrong password, please try again');
  // Current admin cannot change its status
  if (args.status && context.admin._id === args._id) throw new Error('Sorry, you can not change your status');
  const update = {
    ...admin._doc,
    ...args,
    _id: undefined, // id cannot be updated because it is primary key
  };
  let result;
  try {
    result = await Admin.findOneAndUpdate({ _id: args._id }, update, { new: true });
  } catch (e) {
    if (e.code === 11000) throw new Error('Email already exists');
    else throw e;
  }
  return {
    ...result._doc,
    blogs: blogs.bind(this, result._doc.blogs),
  };
};

const deleteAdmin = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  const superAdmin = await Admin.findOne({ email: 'superadmin@email.com' });
  if (superAdmin._id === args._id) throw new Error('Can not delete super admin');
  const admin = await Admin.findById({ _id: args._id });
  if (!admin || !admin._doc) throw new Error('Admin not found');
  if (admin._doc._id === context._id) throw new Error('You can not delete yourselves');
  await Admin.deleteOne({ _id: args._id });
  return args._id;
};

export default {
  queryResolvers: {
    allAdmins,
    admins,
    loggedAdmin,
  },
  mutationResolvers: {
    newAdmin,
    updateAdmin,
    deleteAdmin,
  },
};
