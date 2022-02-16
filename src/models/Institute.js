/* eslint-disable import/extensions */
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import db from '../db/index.js';

autoIncrement.initialize(db);

const InstituteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  courses: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: String,
    required: true,
    default: new Date(),
  },
  faculties: {
    type: [String],
    default: [],
  },
});

InstituteSchema.plugin(autoIncrement.plugin, 'Institute');
const Institute = mongoose.model('Institute', InstituteSchema);

export default Institute;
