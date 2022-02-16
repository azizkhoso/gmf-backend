/* eslint-disable import/extensions */
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import db from '../db/index.js';

autoIncrement.initialize(db);

const AdminSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  blogs: {
    type: [{
      type: Number,
      ref: 'Blog',
    }],
    default: [],
  },
  facebookLink: {
    type: String,
    default: '',
  },
  instagramLink: {
    type: String,
    default: '',
  },
  twitterLink: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    required: true,
    default: 'Active',
  },
  confirmationCode: {
    type: Number,
    default: (Math.random() * 10000).toFixed(0),
  },
});

AdminSchema.plugin(autoIncrement.plugin, 'Admin');
const Admin = mongoose.model('Admin', AdminSchema);

export default Admin;
