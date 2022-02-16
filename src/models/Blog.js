/* eslint-disable import/extensions */
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import db from '../db/index.js';

autoIncrement.initialize(db);

const BlogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  writtenBy: {
    type: Number,
    ref: 'Admin',
    required: true,
    default: -1,
  },
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    requred: true,
    default: new Date(),
  },
});

BlogSchema.plugin(autoIncrement.plugin, 'Blog');
const Blog = mongoose.model('Blog', BlogSchema);

export default Blog;
