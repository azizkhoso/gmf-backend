/* eslint-disable import/extensions */
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import db from '../db/index.js';

autoIncrement.initialize(db);

const FacultySchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    unique: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  institute: {
    type: Number,
    ref: 'Institute',
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  courses: {
    type: [String],
    required: true,
  },
  ratings: {
    type: [{
      type: Number,
      ref: 'Rating',
    }],
    default: [],
  },
  levelOfDifficulty: {
    type: Number,
    default: 0,
  },
  attributes: {
    type: [String],
    default: [],
  },
});

FacultySchema.plugin(autoIncrement.plugin, 'Faculty');
const Faculty = mongoose.model('Faculty', FacultySchema);

export default Faculty;
