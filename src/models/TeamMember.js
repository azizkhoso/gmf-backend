/* eslint-disable import/extensions */
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import db from '../db/index.js';

autoIncrement.initialize(db);

const MemberSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  facebookLink: {
    type: String,
    required: true,
    unique: true,
  },
  instagramLink: {
    type: String,
    required: true,
    unique: true,
  },
  linkedinLink: {
    type: String,
    required: true,
    unique: true,
  },
});

MemberSchema.plugin(autoIncrement.plugin, 'Member');
const Member = mongoose.model('Member', MemberSchema);

export default Member;
