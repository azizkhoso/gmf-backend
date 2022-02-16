/* eslint-disable import/extensions */
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import db from '../db/index.js';

autoIncrement.initialize(db);

const AdSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  locationId: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'Active',
  },
});

AdSchema.plugin(autoIncrement.plugin, 'Ad');
const Ad = mongoose.model('Ad', AdSchema);

export default Ad;
