/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import db from '../db/index.js';

autoIncrement.initialize(db);

const RatingSchema = mongoose.Schema({
  user: {
    type: Number,
    ref: 'User',
    required: true,
  },
  faculty: {
    type: Number,
    ref: 'Faculty',
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  overAllRating: {
    type: Number, // 1 to 12, 12 = A, 1 = F
    required: true,
    default: 0,
  },
  levelOfDifficulty: {
    type: Number,
    required: true,
    default: 0,
  },
  tags: {
    type: [String],
    required: true,
    default: [],
  },
  wouldTakeAgain: {
    type: Boolean,
    required: true,
    default: false,
  },
  isAttendanceMandatory: {
    type: Boolean,
    required: true,
    default: false,
  },
  thoughts: {
    type: String,
    required: true,
  },
  likes: {
    type: [{
      type: Number,
      ref: 'User',
    }],
    default: [],
  },
  disLikes: {
    type: [{
      type: Number,
      ref: 'User',
    }],
    default: [],
  },
  reports: {
    type: [{
      type: Number,
      ref: 'Report',
    }],
    default: [],
  },
});

RatingSchema.plugin(autoIncrement.plugin, 'Rating');
const Rating = mongoose.model('Rating', RatingSchema);

export default Rating;
