/* eslint-disable import/extensions */
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import db from '../db/index.js';

autoIncrement.initialize(db);

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
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
  institute: {
    type: String,
    default: '',
  },
  savedFaculties: {
    type: [{
      type: Number,
      ref: 'Faculty',
    }],
    default: [],
  },
  graduationYear: {
    type: Number,
    default: -1,
  },
  registeredAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  ratings: {
    type: [{
      type: Number,
      ref: 'Rating',
    }],
    default: [],
  },
  confirmationCode: {
    type: Number,
    default: (Math.random() * 10000).toFixed(0),
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

UserSchema.plugin(autoIncrement.plugin, 'User');
const User = mongoose.model('User', UserSchema);

export default User;
