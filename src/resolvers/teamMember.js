/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
// import imageToUri from 'image-to-uri';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import yup from 'yup';
import TeamMember from '../models/TeamMember.js';

const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

const newMemberSchema = yup.object({
  image: yup.mixed().required('Image is required'),
  name: yup.string().required('First name is required').min(2, 'Enter at least 2 characters'),
  role: yup.string().required('Last name is required').min(2, 'Enter at least 2 characters'),
  facebookLink: yup.string().matches(urlRegex, 'Not a valid link').required('Facebook link is required'),
  instagramLink: yup.string().matches(urlRegex, 'Not a valid link').required('Instagram link is required'),
  linkedinLink: yup.string().matches(urlRegex, 'Not a valid link').required('Linkedin link is required'),
});

const updateMemberSchema = yup.object({
  image: yup.mixed(),
  name: yup.string().min(2, 'Enter at least 2 characters'),
  role: yup.string().min(2, 'Enter at least 2 characters'),
  facebookLink: yup.string().matches(urlRegex, 'Not a valid link'),
  instagramLink: yup.string().matches(urlRegex, 'Not a valid link'),
  linkedinLink: yup.string().matches(urlRegex, 'Not a valid link'),
});

// Resolvers
const allMembers = async () => {
  const result = await TeamMember.count();
  return result;
};

const members = async (parent, args) => {
  const query = TeamMember.find();
  // name filter; Member whose name starts with or contains name given in arguments
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
  return result.map((mem) => mem._doc);
};

const newMember = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  await newMemberSchema.validate(args); // throws errors on invalid inputs
  const { createReadStream, filename } = await args.image;
  const stream = createReadStream();
  // Saving file with random unique name
  const randomName = crypto.randomBytes(10).toString('base64');
  const extension = path.extname(filename);
  const newFileName = `${randomName}.${extension}`;
  const out = fs.createWriteStream(`uploads/${newFileName}`);
  await stream.pipe(out);
  let result;
  try {
    result = await TeamMember.create({ ...args, image: newFileName });
  } catch (e) {
    if (e.code === 11000) throw new Error('Member already exists or one or more links already exist in another account');
    else throw e;
  }
  return result;
};

const updateMember = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  await updateMemberSchema.validate(args); // throws errors on invalid inputs
  const foundMem = await TeamMember.findById(args._id);
  if (!foundMem || !foundMem._doc) throw new Error('Member not found');
  // Image is supplied, change the contents of previous image but the name should remain same
  if (args.image) {
    const { createReadStream } = await args.image;
    const stream = createReadStream();
    // Saving file with same unique name
    const out = fs.createWriteStream(`uploads/${foundMem._doc.image}`);
    await stream.pipe(out);
  }
  let result;
  try {
    result = await TeamMember.findOneAndUpdate(
      { _id: args._id },
      { ...args, image: undefined }, // Do not update image
      { new: true },
    );
  } catch (e) {
    if (e.code === 11000) throw new Error('Member already exists or one or more links already exist in another account');
    else throw e;
  }
  return result;
};

const deleteMember = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  const foundMem = await TeamMember.findById(args._id);
  if (!foundMem || !foundMem._doc) throw new Error('Member not found');
  await TeamMember.deleteOne({ _id: args._id });
  // Deleting the image
  fs.unlinkSync(`uploads/${foundMem._doc.image}`);
  return args._id;
};

export default {
  queryResolvers: {
    allMembers,
    members,
  },
  mutationResolvers: {
    newMember,
    updateMember,
    deleteMember,
  },
};
