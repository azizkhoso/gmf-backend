/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import * as yup from 'yup';
import User from '../models/User.js';
import AllowedEmail from '../models/AllowedEmail.js';
import transport from './transport.js';

import helperFunctions from './helperFunctions.js';

const { institute, faculties, ratings } = helperFunctions;

const newUserSchema = yup.object({
  firstName: yup.string().required('First name is required').min(2, 'Enter at least 2 characters for first name'),
  lastName: yup.string().required('Last name is required').min(2, 'Enter at least 2 characters for lastname'),
  email: yup.string().email('Enter a valid email').required('Email is required').min(2, 'Enter a valid email'),
  password: yup.string().min(8, 'Password should be at least 8 characters long').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
});

const updateUserSchema = yup.object({
  firstName: yup.string().min(2, 'Enter at least 2 characters for first name'),
  lastName: yup.string().min(2, 'Enter at least 2 characters for last name'),
  email: yup.string().email('Enter a valid email').min(2, 'Enter a valid email'),
  password: yup.string().min(8, 'Password should be at least 8 characters long'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});

// Resolvers
const allUsers = async () => {
  const result = await User.count();
  return result;
};

const users = async (parent, args) => { // This users is different from one in helperFunctions.js
  const query = User.find();
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
  return result.map((user) => ({
    ...user._doc,
    institute: institute.bind(this, user._doc.institute),
    savedFaculties: faculties.bind(this, user._doc.savedFaculties),
    ratings: ratings.bind(this, user._doc.ratings),
  }));
};

const user = async (parent, args) => {
  const nullUser = {
    _id: -1,
    firstName: 'N/A',
    lastName: 'N/A',
    email: 'N/A',
    institute: institute.bind(this, -1),
    savedFaculties: [],
    graduationYear: -1,
    registeredAt: new Date(),
    ratings: [],
  };
  const result = await User.findOne({ email: args.email });
  if (!result || !result._doc) return nullUser;
  return {
    ...result._doc,
    institute: institute.bind(this, result._doc.institute),
    savedFaculties: faculties.bind(this, result._doc.savedFaculties),
    ratings: ratings.bind(this, result._doc.ratings),
  };
};

const loggedUser = async (parent, args, context) => {
  if (!context.user) throw new Error('User not loggedIn');
  const usr = await User.findOne({ email: context.user.toLowerCase() });
  return { ...context, usr };
};

const newUser = async (parent, args) => {
  await newUserSchema.validate(args); // On invalid inputs throws errors
  const confirmationCode = (Math.random() * 10000).toFixed(0);
  const usr = {
    ...args,
    email: args.email.toLowerCase(),
    confirmationCode,
  };
  const allowedEmails = await AllowedEmail.find(
    {},
    { emailDomain: 1, status: 1 },
  ); // get only emailDomain and status
  const foundEmail = allowedEmails.find((e) => e.emailDomain === usr.email.split('@')[1] && e.status === 'Active');
  if (!foundEmail) throw new Error(`Provided '${usr.email.split('@')[1]}' email domain is not allowed`);
  let result;
  try {
    result = await User.create(usr);
  } catch (e) {
    if (e.code === 11000) throw new Error('User already exists');
    else throw e;
  }
  await transport.sendMail({
    from: process.env.GMAIL,
    to: usr.email,
    subject: 'Email Verification',
    // eslint-disable-next-line quotes
    html: `
      <h1>Hello ${usr.firstName}!</h1>
      <p>Thank you for registering in Grade My Faculty.</p>
      <a href="${process.env.SERVER_URL}/verifyemail?email=${usr.email}&confirmationCode=${confirmationCode}">
        Click here to verify your email
      </a>
    `,
  });
  return result;
};

const adminUpdateUser = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in, please login first');
  await updateUserSchema.validate(args); // On invalid inputs throws errors
  const usr = (await User.findOne({ _id: args._id }))._doc;
  const update = {
    ...usr,
    ...args,
    email: args.email?.toLowerCase(),
  };
  let result;
  // If different email is supplied, a verification mail should be sent
  if (args.email && (args.email !== usr.email)) {
    const allowedEmails = await AllowedEmail.find(
      {},
      { emailDomain: 1, status: 1 },
    ); // get only email domain and status
    const foundEmail = allowedEmails.find((e) => e.emailDomain === args.email.split('@')[1] && e.status === 'Active');
    if (!foundEmail) throw new Error(`Provided '${args.email.split('@')[1]}' email domain is not allowed`);
    const confirmationCode = (Math.random() * 10000).toFixed(0);
    try {
      result = await User.findOneAndUpdate(
        { _id: args._id },
        { ...update, verified: false, confirmationCode },
        { new: true },
      );
      await transport.sendMail({
        from: process.env.GMAIL,
        to: args.email,
        subject: 'Email Verification',
        // eslint-disable-next-line quotes
        html: `
          <h1>Hello ${usr.firstName}!</h1>
          <p>Thank you for registering in Grade My Faculty.</p>
          <a href="https://grade-my-faculty-backend.herokuapp.com/verifyemail?email=${args.email}&confirmationCode=${confirmationCode}">
            Click here to verify your email
          </a>
        `,
      });
      return result;
    } catch (e) {
      if (e.code === 11000) throw new Error('Email already exists');
      else throw e;
    }
  }
  // If email is not supplied or is same as already given, simply update the record
  result = await User.findOneAndUpdate({ _id: args._id }, { ...update }, { new: true });
  return result;
};

const deleteUser = async (parent, args, context) => {
  if (!context.user && !context.admin) throw new Error('Not logged in, please login first');
  await User.deleteOne({ _id: args._id });
  return args._id;
};

export default {
  queryResolvers: {
    allUsers,
    users,
    user,
    loggedUser,
  },
  mutationResolvers: {
    newUser,
    adminUpdateUser,
    deleteUser,
  },
};
