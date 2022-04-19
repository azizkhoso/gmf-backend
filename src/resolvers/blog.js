/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import yup from 'yup';
import Admin from '../models/Admin.js';
import Blog from '../models/Blog.js';

import helperFunctions from './helperFunctions.js';

const { admin } = helperFunctions;

const newBlogSchema = yup.object({
  title: yup.string().required('Title is required').min(2, 'Enter at least 2 characters'),
  content: yup.string().required('Content is required').min(50, 'Enter at least 50 characters'),
});

const updateBlogSchema = yup.object({
  title: yup.string().min(2, 'Enter at least 2 characters'),
  content: yup.string().min(50, 'Enter at least 50 characters'),
});

// Resolvers
const allBlogs = async () => {
  const result = await Blog.count();
  return result;
};

const blogs = async (parent, args) => { // This blogs is different from one in helperFunctions.js
  const query = Blog.find().sort('-createdAt');
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
  return result.map((b) => ({
    ...b._doc,
    writtenBy: admin.bind(this, b._doc.writtenBy),
  }));
};

const newBlog = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  await newBlogSchema.validate(args); // throws errors on invalid inputs
  const foundBlog = await Blog.findOne({ title: { $regex: new RegExp(`^${args.title.toLowerCase()}`, 'i') } });
  if (foundBlog) throw new Error('Blog already exists');
  const foundAdmin = await Admin.findById(context._id);
  if (!foundAdmin || !foundAdmin._doc) throw new Error('Admin not found');
  let result;
  try {
    result = await Blog.create(
      { ...args, writtenBy: context._id, createdAt: (new Date()).toISOString() },
    );
    // New blog should be listed in admin
    await foundAdmin.updateOne({ $push: { blogs: result._doc._id } });
  } catch (e) {
    if (e.code === 11000) throw new Error('Blog already exists');
    else throw e;
  }
  return {
    ...result._doc,
    writtenBy: admin.bind(this, result._doc._id),
  };
};

const updateBlog = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  await updateBlogSchema.validate(args); // throws errors on invalid inputs
  // load as minimal data as possible
  const foundBlog = await Blog.findById(args._id, { _id: 1, title: 1 });
  if (!foundBlog || !foundBlog._doc) throw new Error('Blog not found');
  // If title is supplied in args, check if that already exists with different id
  if (args.title) {
    const anotherBlog = await Blog.findOne({ title: { $regex: new RegExp(args.title, 'ig') } }, { title: 1, _id: 1 });
    if (anotherBlog && anotherBlog._doc._id !== foundBlog._doc._id) throw new Error('Blog title already exists');
  }
  const result = await Blog.findOneAndUpdate(
    { _id: args._id },
    { ...args, _id: undefined },
    { new: true },
  );
  return {
    ...result._doc,
    writtenBy: admin.bind(this, result._doc._id),
  };
};

const deleteBlog = async (parent, args, context) => {
  if (!context.admin) throw new Error('Not logged in or session expired, please login');
  const blg = await Blog.findById(args._id);
  if (!blg || !blg._doc) throw new Error('Blog not found');
  await Admin.findOneAndUpdate({ _id: blg._doc.writtenBy }, { $pull: { blogs: args._id } });
  await blg.deleteOne();
  return args._id;
};

export default {
  queryResolvers: {
    allBlogs,
    blogs,
  },
  mutationResolvers: {
    newBlog,
    updateBlog,
    deleteBlog,
  },
};
